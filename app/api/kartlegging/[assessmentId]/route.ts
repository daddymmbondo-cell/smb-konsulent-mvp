import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assessmentSchema } from "@/lib/validation";
import { calculateAllMetrics } from "@/lib/metrics/calculate";
import { generateRecommendations } from "@/lib/recommendations/engine";
import { emailAdapter } from "@/lib/email/adapter";

export async function PATCH(req: NextRequest, { params }: { params: { assessmentId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Ikke innlogget." }, { status: 401 });
  }

  // Tilgangskontroll: kartleggingen må tilhøre en organisasjon brukeren er medlem av
  const assessment = await prisma.assessment.findUnique({
    where: { id: params.assessmentId },
    include: { organization: { include: { members: true } } },
  });

  if (!assessment || !assessment.organization.members.some((m) => m.userId === userId)) {
    return NextResponse.json({ message: "Ikke tilgang." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Ugyldig forespørsel." }, { status: 400 });
  }

  const parsed = assessmentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Noen felter er ugyldige.", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { submit, ...answers } = parsed.data;

  const savedAnswers = await prisma.assessmentAnswer.upsert({
    where: { assessmentId: assessment.id },
    create: { assessmentId: assessment.id, ...answers },
    update: { ...answers },
  });

  if (submit) {
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { status: "INNSENDT", submittedAt: new Date() },
    });

    // Beregn nøkkeltall og lagre dem
    const metrics = calculateAllMetrics(savedAnswers);
    await prisma.$transaction(
      metrics.map((m) =>
        prisma.metric.create({
          data: {
            assessmentId: assessment.id,
            key: m.key,
            value: m.value,
            isEstimate: m.isEstimate,
          },
        })
      )
    );

    // Generer anbefalinger (regelbasert, ingen KI i produksjon ennå)
    const recommendations = generateRecommendations(metrics, {
      staffingChallenges: savedAnswers.staffingChallenges,
      managementChallenges: savedAnswers.managementChallenges,
      digitalToolsUsage: savedAnswers.digitalToolsUsage,
    });

    await prisma.$transaction(
      recommendations.map((r, index) =>
        prisma.recommendation.create({
          data: {
            assessmentId: assessment.id,
            title: r.title,
            problem: r.problem,
            whyItMatters: r.whyItMatters,
            action: r.action,
            effort: r.effort,
            priority: index + 1,
            firstStep: r.firstStep,
            whatToMeasure: r.whatToMeasure,
          },
        })
      )
    );

    await emailAdapter.send({
      to: "[ADMIN_EPOST]",
      subject: `Kartlegging mottatt: ${assessment.organization.name}`,
      templateKey: "assessment-received",
      data: { organizationName: assessment.organization.name },
    });
  }

  return NextResponse.json({ ok: true, submitted: Boolean(submit) });
}

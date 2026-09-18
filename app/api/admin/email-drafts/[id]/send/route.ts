import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOutboundEmailAdapter } from "@/lib/email/outbound";
import { isMicrosoftIntegrationEnabled } from "@/lib/graph/client";
import { z } from "zod";

const sendSchema = z
  .object({
    recipientEmail: z.string().email(),
  })
  .strict();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ message: "Ikke tilgang." }, { status: 403 });
  }

  const draft = await prisma.emailDraft.findUnique({ where: { id: params.id } });
  if (!draft) {
    return NextResponse.json({ message: "Fant ikke utkastet." }, { status: 404 });
  }
  if (draft.status !== "GODKJENT") {
    return NextResponse.json(
      { message: "Utkastet må være godkjent før det kan sendes." },
      { status: 400 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Mangler mottakerens e-postadresse." }, { status: 400 });
  }

  const parsed = sendSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ugyldig mottaker-e-post." }, { status: 400 });
  }

  const adapter = getOutboundEmailAdapter();

  try {
    await adapter.send({
      to: parsed.data.recipientEmail,
      subject: draft.subject,
      templateKey: "new-message", // generisk — selve teksten kommer fra draft.body
      data: { body: draft.body },
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: `Sending feilet: ${err instanceof Error ? err.message : "ukjent feil"}`,
      },
      { status: 502 }
    );
  }

  await prisma.emailDraft.update({
    where: { id: params.id },
    data: { status: "SENDT", sentAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    sentVia: isMicrosoftIntegrationEnabled() ? "microsoft-graph" : "dev-logger",
  });
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z
  .object({
    action: z.enum(["godkjenn", "forkast"]),
    subject: z.string().max(200).optional(),
    body: z.string().max(5000).optional(),
  })
  .strict();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN" || !userId) {
    return NextResponse.json({ message: "Ikke tilgang." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Ugyldig forespørsel." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ugyldige felter." }, { status: 400 });
  }

  const draft = await prisma.emailDraft.findUnique({ where: { id: params.id } });
  if (!draft) {
    return NextResponse.json({ message: "Fant ikke utkastet." }, { status: 404 });
  }

  if (parsed.data.action === "godkjenn") {
    // NB: "Godkjent" betyr klart for utsendelse — selve utsendelsen skjer via en
    // tilkoblet e-postkonto (Microsoft Graph) når den er satt opp, eller manuelt
    // ved å kopiere teksten. Systemet sender ALDRI dette automatisk.
    await prisma.emailDraft.update({
      where: { id: params.id },
      data: {
        status: "GODKJENT",
        subject: parsed.data.subject ?? draft.subject,
        body: parsed.data.body ?? draft.body,
        approvedById: userId,
        approvedAt: new Date(),
      },
    });
  } else {
    await prisma.emailDraft.update({
      where: { id: params.id },
      data: { status: "FORKASTET" },
    });
  }

  return NextResponse.json({ ok: true });
}

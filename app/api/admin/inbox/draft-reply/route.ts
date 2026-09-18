import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { draftReplyEmail } from "@/lib/leads/email-draft";
import { z } from "zod";

const schema = z
  .object({
    subject: z.string().max(300),
    senderName: z.string().max(200).optional(),
    summary: z.string().max(500),
  })
  .strict();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ message: "Ikke tilgang." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Ugyldig forespørsel." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ugyldige felter." }, { status: 400 });
  }

  const { subject, body } = draftReplyEmail({
    incomingSubject: parsed.data.subject,
    incomingSenderName: parsed.data.senderName,
    incomingSummary: parsed.data.summary,
  });

  const draft = await prisma.emailDraft.create({
    data: {
      purpose: "svar-innkommende",
      subject,
      body,
      status: "UTKAST",
    },
  });

  return NextResponse.json({ ok: true, draftId: draft.id });
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { draftFirstContactEmail } from "@/lib/leads/email-draft";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ message: "Ikke tilgang." }, { status: 403 });
  }

  const suggested = await prisma.suggestedLead.findUnique({ where: { id: params.id } });
  if (!suggested) {
    return NextResponse.json({ message: "Fant ikke kundeemnet." }, { status: 404 });
  }

  const { subject, body } = draftFirstContactEmail({
    companyName: suggested.name,
    naceDescription: suggested.naceDescription,
    municipality: suggested.municipality,
  });

  const draft = await prisma.emailDraft.create({
    data: {
      suggestedLeadId: suggested.id,
      purpose: "forstekontakt",
      subject,
      body,
      status: "UTKAST",
    },
  });

  return NextResponse.json({ ok: true, draftId: draft.id });
}

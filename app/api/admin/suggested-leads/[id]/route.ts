import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z
  .object({
    action: z.enum(["godkjenn", "avvis", "konverter"]),
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
    return NextResponse.json({ message: "Ugyldig handling." }, { status: 400 });
  }

  const suggested = await prisma.suggestedLead.findUnique({ where: { id: params.id } });
  if (!suggested) {
    return NextResponse.json({ message: "Fant ikke kundeemnet." }, { status: 404 });
  }

  if (parsed.data.action === "godkjenn") {
    await prisma.suggestedLead.update({
      where: { id: params.id },
      data: { status: "GODKJENT", reviewedById: userId, reviewedAt: new Date() },
    });
  } else if (parsed.data.action === "avvis") {
    await prisma.suggestedLead.update({
      where: { id: params.id },
      data: { status: "AVVIST", reviewedById: userId, reviewedAt: new Date() },
    });
  } else if (parsed.data.action === "konverter") {
    // Krever at kontaktinfo (e-post/telefon) fylles inn manuelt etterpå —
    // registeret gir ikke direkte kontaktinfo, kun virksomhetsdata.
    if (suggested.convertedLeadId) {
      return NextResponse.json({ message: "Allerede konvertert." }, { status: 409 });
    }
    const lead = await prisma.lead.create({
      data: {
        name: "[FYLL INN KONTAKTPERSON]",
        businessName: suggested.name,
        email: "[FYLL INN E-POST]",
        phone: "[FYLL INN TELEFON]",
        businessType: suggested.naceDescription,
        consentGiven: false, // må aktivt bekreftes før kontakt, jf. markedsføringsloven
        status: "NY",
      },
    });
    await prisma.suggestedLead.update({
      where: { id: params.id },
      data: {
        status: "KONVERTERT",
        convertedLeadId: lead.id,
        reviewedById: userId,
        reviewedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true, leadId: lead.id });
  }

  return NextResponse.json({ ok: true });
}

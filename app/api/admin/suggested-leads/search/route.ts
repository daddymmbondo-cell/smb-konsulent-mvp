import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchEnheter, BrregApiError } from "@/lib/leads/bronnoyund";
import { z } from "zod";

const searchSchema = z
  .object({
    naeringskode: z.string().min(2).max(10),
    kommunenummer: z.string().max(4).optional(),
    fraAntallAnsatte: z.coerce.number().int().min(0).optional(),
    tilAntallAnsatte: z.coerce.number().int().min(0).optional(),
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

  const parsed = searchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ugyldige søkeparametere.", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  let result;
  try {
    result = await searchEnheter(parsed.data);
  } catch (err) {
    if (err instanceof BrregApiError) {
      return NextResponse.json({ message: err.message }, { status: 502 });
    }
    return NextResponse.json({ message: "Ukjent feil ved søk." }, { status: 500 });
  }

  const sourceQuery = JSON.stringify(parsed.data);

  const saved = await Promise.all(
    result.enheter.map((enhet) =>
      prisma.suggestedLead.upsert({
        where: { orgNumber: enhet.organisasjonsnummer },
        update: {
          name: enhet.navn,
          naceCode: enhet.naeringskode1?.kode,
          naceDescription: enhet.naeringskode1?.beskrivelse,
          municipality: enhet.forretningsadresse?.kommune,
          employeeCountFrom: enhet.antallAnsatte,
          website: enhet.hjemmeside,
        },
        create: {
          orgNumber: enhet.organisasjonsnummer,
          name: enhet.navn,
          naceCode: enhet.naeringskode1?.kode,
          naceDescription: enhet.naeringskode1?.beskrivelse,
          municipality: enhet.forretningsadresse?.kommune,
          employeeCountFrom: enhet.antallAnsatte,
          website: enhet.hjemmeside,
          sourceQuery,
        },
      })
    )
  );

  return NextResponse.json({ ok: true, count: saved.length, totalAvailable: result.totalElements });
}

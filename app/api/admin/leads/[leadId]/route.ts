import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statusSchema = z
  .object({
    status: z.enum(["NY", "KONTAKTET", "MOTE_BOOKET", "TILBUD_SENDT", "VUNNET", "TAPT"]),
  })
  .strict();

export async function PATCH(req: NextRequest, { params }: { params: { leadId: string } }) {
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

  const parsed = statusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ugyldig status." }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: params.leadId } });
  if (!lead) {
    return NextResponse.json({ message: "Fant ikke leadet." }, { status: 404 });
  }

  await prisma.lead.update({
    where: { id: params.leadId },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true });
}

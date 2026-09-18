import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isMicrosoftIntegrationEnabled } from "@/lib/graph/client";
import { createCalendarEvent } from "@/lib/graph/calendar";
import { z } from "zod";

const confirmSchema = z
  .object({
    startIso: z.string().datetime(),
    endIso: z.string().datetime(),
  })
  .strict();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ message: "Ikke tilgang." }, { status: 403 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { lead: true },
  });
  if (!booking) {
    return NextResponse.json({ message: "Fant ikke bookingen." }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Ugyldig forespørsel." }, { status: 400 });
  }

  const parsed = confirmSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ugyldig tidspunkt." }, { status: 400 });
  }

  let calendarEventId: string | null = null;

  if (isMicrosoftIntegrationEnabled()) {
    try {
      const event = await createCalendarEvent({
        subject: `Kartleggingssamtale — ${booking.lead.businessName}`,
        startIso: parsed.data.startIso,
        endIso: parsed.data.endIso,
        attendeeEmail: booking.lead.email,
        bodyText: `Uforpliktende kartleggingssamtale med ${booking.lead.name} (${booking.lead.businessName}).`,
      });
      calendarEventId = event.id;
    } catch (err) {
      return NextResponse.json(
        { message: `Kunne ikke opprette kalenderhendelse: ${err instanceof Error ? err.message : "ukjent feil"}` },
        { status: 502 }
      );
    }
  }

  await prisma.booking.update({
    where: { id: params.id },
    data: {
      confirmedTime: new Date(parsed.data.startIso),
      externalCalendarRef: calendarEventId,
    },
  });

  return NextResponse.json({
    ok: true,
    calendarEventCreated: Boolean(calendarEventId),
  });
}

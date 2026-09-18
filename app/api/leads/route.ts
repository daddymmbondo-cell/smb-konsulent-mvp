import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { emailAdapter } from "@/lib/email/adapter";

export async function POST(req: NextRequest) {
  // Rate-limit basert på IP (best-effort — se lib/rate-limit.ts for begrensninger)
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`lead:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { message: "For mange forsøk. Vent litt og prøv igjen." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Ugyldig forespørsel." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Vennligst rett feltene og prøv igjen.", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Honeypot-feltet skal alltid være tomt — hvis noe har fylt det ut, avvis stille som suksess
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { website, preferredTime, ...leadData } = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        name: leadData.name,
        businessName: leadData.businessName,
        email: leadData.email,
        phone: leadData.phone,
        businessType: leadData.businessType,
        employeeCount: leadData.employeeCount,
        revenueRange: leadData.revenueRange,
        biggestChallenge: leadData.biggestChallenge,
        message: leadData.message,
        consentGiven: leadData.consentGiven,
        ...(preferredTime
          ? { booking: { create: { preferredTime } } }
          : {}),
      },
    });

    // Varsle administrator (dev-adapter logger lokalt i MVP)
    await emailAdapter.send({
      to: "[ADMIN_EPOST]",
      subject: `Nytt lead: ${lead.businessName}`,
      templateKey: "new-lead",
      data: { name: lead.name, businessName: lead.businessName, email: lead.email, phone: lead.phone },
    });

    // Bekreftelse til kunden
    await emailAdapter.send({
      to: lead.email,
      subject: "Vi har mottatt din henvendelse",
      templateKey: "contact-received",
      data: { name: lead.name },
    });

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Feil ved lagring av lead:", error);
    return NextResponse.json(
      { message: "Noe gikk galt på vår side. Prøv igjen om litt." },
      { status: 500 }
    );
  }
}

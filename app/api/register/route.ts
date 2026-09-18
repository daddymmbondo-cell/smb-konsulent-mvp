import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { emailAdapter } from "@/lib/email/adapter";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`register:${ip}`, 5, 60_000)) {
    return NextResponse.json({ message: "For mange forsøk. Vent litt og prøv igjen." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Ugyldig forespørsel." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Vennligst rett feltene og prøv igjen.", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ message: "E-postadressen er allerede registrert." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: parsed.data.organizationName },
    });

    const user = await tx.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    await tx.organizationMember.create({
      data: { userId: user.id, organizationId: organization.id },
    });

    return { user, organization };
  });

  await emailAdapter.send({
    to: result.user.email,
    subject: "Velkommen til kundeportalen",
    templateKey: "welcome-portal",
    data: { name: result.user.name },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

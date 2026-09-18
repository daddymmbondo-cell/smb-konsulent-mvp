// Oppretter ÉN ekte adminbruker — for bruk i produksjon, i stedet for
// seed.ts (som oppretter tydelig merkede testbrukere med kjente passord,
// upassende for en offentlig database).
//
// Kjør med: npx tsx prisma/create-admin.ts <e-post> <passord> <navn>
// Eksempel: npx tsx prisma/create-admin.ts meg@firma.no "MittEkteSikrePassord!" "Ola Nordmann"

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [, , email, password, name] = process.argv;

  if (!email || !password || !name) {
    console.error("Bruk: npx tsx prisma/create-admin.ts <e-post> <passord> <navn>");
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("Passordet bør være minst 12 tegn for en produksjons-adminkonto.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`En bruker med e-post ${email} finnes allerede.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: { name, email, passwordHash, role: "ADMIN" },
  });

  console.log(`Adminbruker opprettet: ${admin.email}`);
  console.log("Bytt gjerne passordet igjen etter første innlogging, og lagre det trygt (passordbehandler).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

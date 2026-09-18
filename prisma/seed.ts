import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeder lokal utviklingsdatabase med falske testdata...");

  // Adminbruker — passord genereres her, ikke hardkodet i kildekoden.
  // Skriv det ut lokalt og bytt det etter første innlogging.
  const adminPassword = "EndreMeg123!"; // KUN for lokal utvikling — aldri i produksjon
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@eksempel-testdata.no" },
    update: {},
    create: {
      name: "Test Administrator (falske data)",
      email: "admin@eksempel-testdata.no",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  // Eksempelkunde
  const customerPasswordHash = await bcrypt.hash("EndreMeg123!", 12);
  const org = await prisma.organization.create({
    data: { name: "Eksempel Dagligvare AS (testdata)" },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Test Kunde (falske data)",
      email: "kunde@eksempel-testdata.no",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
  });

  await prisma.organizationMember.create({
    data: { userId: customerUser.id, organizationId: org.id },
  });

  // Et par eksempel-leads
  await prisma.lead.createMany({
    data: [
      {
        name: "Ola Testperson",
        businessName: "Test Kiosk AS (falske data)",
        email: "ola@eksempel-testdata.no",
        phone: "99999999",
        businessType: "Kiosk",
        employeeCount: "3",
        biggestChallenge: "Høy personalkostnad i helgene",
        consentGiven: true,
        status: "NY",
      },
      {
        name: "Kari Testperson",
        businessName: "Test Butikk AS (falske data)",
        email: "kari@eksempel-testdata.no",
        phone: "98989898",
        businessType: "Dagligvare",
        employeeCount: "12",
        biggestChallenge: "Svinn på ferskvarer",
        consentGiven: true,
        status: "KONTAKTET",
      },
    ],
  });

  console.log("Ferdig. Testbrukere (KUN lokal utvikling):");
  console.log(`  Admin:  ${admin.email} / ${adminPassword}`);
  console.log(`  Kunde:  ${customerUser.email} / EndreMeg123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

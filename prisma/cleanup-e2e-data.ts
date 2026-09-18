// Rydder opp data generert av E2E-testene (tests/e2e/*.spec.ts), som alle
// bruker e-postadresser på formen "...@e2e-test.no". Dette lar deg kjøre
// testene mot samme database som du bruker til manuell testing/demo, uten at
// leads og kundekontoer fra testkjøringer hoper seg opp i lead-listen og
// dashboardet.
//
// Kjør med: npm run cleanup:e2e-data
//
// For et helt rent oppsett før en demo, bruk heller `npx prisma migrate reset`
// (sletter ALT og kjører seed på nytt) — dette skriptet er for å rydde KUN
// testdata uten å miste ekte data du har lagt inn underveis.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Rydder opp E2E-testdata (e2e-test.no)...");

  const leadsResult = await prisma.lead.deleteMany({
    where: { email: { endsWith: "@e2e-test.no" } },
  });
  console.log(`  Slettet ${leadsResult.count} lead(s).`);

  const usersToDelete = await prisma.user.findMany({
    where: { email: { endsWith: "@e2e-test.no" } },
    select: { id: true },
  });
  const userIds = usersToDelete.map((u) => u.id);

  const orgIds = await prisma.organizationMember.findMany({
    where: { userId: { in: userIds } },
    select: { organizationId: true },
  });
  const uniqueOrgIds = [...new Set(orgIds.map((o) => o.organizationId))];

  // Sletter organisasjonen (kaskaderer til medlemskap, kartlegginger,
  // nøkkeltall og anbefalinger via onDelete: Cascade i skjemaet)
  const orgsResult = await prisma.organization.deleteMany({
    where: { id: { in: uniqueOrgIds } },
  });
  console.log(`  Slettet ${orgsResult.count} organisasjon(er) (med tilhørende data).`);

  const usersResult = await prisma.user.deleteMany({
    where: { email: { endsWith: "@e2e-test.no" } },
  });
  console.log(`  Slettet ${usersResult.count} bruker(e).`);

  console.log("Ferdig.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

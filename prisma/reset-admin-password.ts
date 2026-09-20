// Nullstiller passordet til en EKSISTERENDE adminbruker (brukes når man har
// glemt passordet, eller er usikker på om det noensinne ble satt et ekte
// passord). Oppretter ALDRI en ny bruker — se prisma/create-admin.ts for det.
//
// Tilkoblingsstrengene til produksjonsdatabasen leses fra en egen fil,
// neon-admin-secret.local (i prosjektroten) — IKKE fra PowerShell-
// miljøvariabler. Dette er bevisst, etter gjentatte feil der
// $env:DATABASE_URL=... ble limt inn eller kjørt feil i PowerShell.
// neon-admin-secret.local står i .gitignore og committes derfor aldri.
//
// Slik kjører du dette:
//   1. cd til prosjektroten i PowerShell
//   2. npx tsx prisma/reset-admin-password.ts
//   3. Slett gjerne neon-admin-secret.local etterpå — den inneholder
//      produksjonspassordet til databasen i klartekst.

import path from "node:path";

const envPath = path.resolve(process.cwd(), "neon-admin-secret.local");
try {
  process.loadEnvFile(envPath);
} catch (e) {
  console.error(
    `Fant ikke ${envPath}.\n` +
      `Kjør scriptet fra prosjektroten (der package.json ligger), og sørg for at ` +
      `neon-admin-secret.local finnes der.`
  );
  process.exit(1);
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "node:readline";

const prisma = new PrismaClient();

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);

    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      // Fallback (f.eks. ved input via pipe) — ikke skjult, men fungerer likevel.
      const rl = readline.createInterface({ input: stdin, output: process.stdout });
      rl.question("", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    let password = "";
    const onData = (char: string) => {
      const c = char.toString();
      if (c === "\n" || c === "\r" || c === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(password);
        return;
      }
      if (c === "\u0003") {
        // Ctrl+C
        process.stdout.write("\n");
        process.exit(1);
      }
      if (c === "\u007f" || c === "\b") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }
      password += c;
      process.stdout.write("*");
    };
    stdin.on("data", onData);
  });
}

async function main() {
  console.log(`Leser tilkobling fra ${envPath}.`);
  console.log("Nullstiller passordet til en eksisterende adminbruker. Ingenting du skriver inn her havner i shell-historikk.\n");

  const email = await ask("E-post til kontoen du vil nullstille passordet for: ");
  if (!email) {
    console.error("E-post kan ikke være tom.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    console.error(`Fant ingen bruker med e-post ${email}. Bruk prisma/create-admin.ts for å opprette en ny adminbruker i stedet.`);
    process.exit(1);
  }
  if (existing.role !== "ADMIN") {
    console.error(`Brukeren ${email} finnes, men har rollen "${existing.role}", ikke "ADMIN". Avbryter for sikkerhets skyld.`);
    process.exit(1);
  }

  const password = await askHidden("Nytt passord (skjules mens du skriver, minst 12 tegn): ");
  if (password.length < 12) {
    console.error("Passordet bør være minst 12 tegn for en produksjons-adminkonto.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const updated = await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`\nPassordet er nullstilt for: ${updated.email}`);
  console.log("Lagre det nye passordet trygt (passordbehandler) — det vises ikke igjen her.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

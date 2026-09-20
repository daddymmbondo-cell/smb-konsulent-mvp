// Oppretter ÉN ekte adminbruker — for bruk i produksjon, i stedet for
// seed.ts (som oppretter tydelig merkede testbrukere med kjente passord,
// upassende for en offentlig database).
//
// Kjør med: npx tsx prisma/create-admin.ts
// Scriptet spør deg interaktivt om e-post, navn og passord. Passordet
// tastes direkte i terminalen og skjules mens du skriver — det finnes
// ALDRI som tekst i en kommando du kan kopiere eller lime inn feil.

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
  console.log("Oppretter en ekte adminbruker. Ingenting du skriver inn her havner i shell-historikk.\n");

  const email = await ask("E-post: ");
  if (!email) {
    console.error("E-post kan ikke være tom.");
    process.exit(1);
  }

  const name = await ask("Navn: ");
  if (!name) {
    console.error("Navn kan ikke være tomt.");
    process.exit(1);
  }

  const password = await askHidden("Passord (skjules mens du skriver): ");
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

  console.log(`\nAdminbruker opprettet: ${admin.email}`);
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

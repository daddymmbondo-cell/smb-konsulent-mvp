import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Henter innlogget bruker + tilhørende organisasjon på serversiden.
// Sender til innlogging dersom ikke autentisert — tilgangskontroll skjer alltid server-side.
export async function requireCustomerSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/logg-inn");
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/logg-inn");

  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
  });

  if (!membership) {
    redirect("/logg-inn");
  }

  return { session, organization: membership.organization, userId };
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    redirect("/logg-inn");
  }
  return session;
}

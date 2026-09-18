import { requireCustomerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AssessmentWizard } from "@/components/assessment-wizard";

export const metadata = { title: "Kartlegging" };

export default async function KartleggingPage() {
  const { organization } = await requireCustomerSession();

  let assessment = await prisma.assessment.findFirst({
    where: { organizationId: organization.id, status: "UTKAST" },
    include: { answers: true },
    orderBy: { createdAt: "desc" },
  });

  if (!assessment) {
    assessment = await prisma.assessment.create({
      data: { organizationId: organization.id },
      include: { answers: true },
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">Drifts- og lønnsomhetskartlegging</h1>
      <p className="mt-2 text-sm text-slate-600">
        Du kan lagre utkast underveis og fortsette senere. Alle beløp oppgis i kroner per måned der
        ikke annet er angitt.
      </p>
      <div className="mt-8">
        <AssessmentWizard
          assessmentId={assessment.id}
          initialValues={assessment.answers ?? {}}
        />
      </div>
    </main>
  );
}

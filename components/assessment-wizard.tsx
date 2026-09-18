"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentSchema, type AssessmentInput } from "@/lib/validation";

type Step = {
  id: string;
  title: string;
  fields: Array<{ name: keyof AssessmentInput; label: string; type?: "text" | "number" | "textarea" }>;
};

const steps: Step[] = [
  {
    id: "virksomhet",
    title: "Del A: Virksomhet",
    fields: [
      { name: "businessType", label: "Type virksomhet" },
      { name: "employeeCount", label: "Antall ansatte", type: "number" },
      { name: "locationCount", label: "Antall lokasjoner", type: "number" },
      { name: "openingHours", label: "Åpningstider" },
      { name: "region", label: "Geografisk område" },
      { name: "businessModel", label: "Forretningsmodell", type: "textarea" },
    ],
  },
  {
    id: "salg",
    title: "Del B: Salg",
    fields: [
      { name: "monthlyRevenue", label: "Månedlig omsetning (kr)", type: "number" },
      { name: "salesTrend", label: "Salgstrend siste 12 måneder" },
      { name: "averagePurchase", label: "Gjennomsnittlig kjøp (kr)", type: "number" },
      { name: "mainRevenueSource", label: "Viktigste inntektskilde" },
      { name: "seasonality", label: "Sesongsvingninger", type: "textarea" },
    ],
  },
  {
    id: "kostnader",
    title: "Del C: Kostnader",
    fields: [
      { name: "laborCost", label: "Lønnskostnader per måned (kr)", type: "number" },
      { name: "rentCost", label: "Husleie per måned (kr)", type: "number" },
      { name: "goodsCost", label: "Varekostnad per måned (kr)", type: "number" },
      { name: "electricityCost", label: "Strøm per måned (kr)", type: "number" },
      { name: "transportCost", label: "Transport per måned (kr)", type: "number" },
      { name: "marketingCost", label: "Markedsføring per måned (kr)", type: "number" },
      { name: "otherFixedCosts", label: "Andre faste kostnader per måned (kr)", type: "number" },
    ],
  },
  {
    id: "drift",
    title: "Del D: Drift",
    fields: [
      { name: "shrinkage", label: "Svinn per måned (kr)", type: "number" },
      { name: "staffingChallenges", label: "Bemanningsutfordringer", type: "textarea" },
      { name: "sickLeavePercent", label: "Sykefravær (%)", type: "number" },
      { name: "inventoryChallenges", label: "Lagerutfordringer", type: "textarea" },
      { name: "purchasingRoutines", label: "Innkjøpsrutiner", type: "textarea" },
      { name: "digitalToolsUsage", label: "Bruk av digitale verktøy", type: "textarea" },
    ],
  },
  {
    id: "ledelse",
    title: "Del E: Ledelse",
    fields: [
      { name: "managerCount", label: "Antall ledere", type: "number" },
      { name: "managementChallenges", label: "Lederutfordringer", type: "textarea" },
      { name: "staffFollowUp", label: "Medarbeideroppfølging", type: "textarea" },
      { name: "training", label: "Opplæring", type: "textarea" },
      { name: "goalManagement", label: "Målstyring", type: "textarea" },
      { name: "meetingRoutines", label: "Møte- og rapporteringsrutiner", type: "textarea" },
    ],
  },
  {
    id: "mal",
    title: "Del F: Mål",
    fields: [
      { name: "goals90Days", label: "Viktigste mål neste 90 dager", type: "textarea" },
      { name: "desiredImprovement", label: "Ønsket forbedring", type: "textarea" },
      { name: "mainObstacle", label: "Største hindring", type: "textarea" },
      { name: "desiredHelp", label: "Ønsket hjelp", type: "textarea" },
    ],
  },
];

export function AssessmentWizard({
  assessmentId,
  initialValues,
}: {
  assessmentId: string;
  initialValues: Partial<AssessmentInput>;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
  } = useForm<AssessmentInput>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: { ...initialValues, submit: false },
  });

  const isLastStep = currentStep === steps.length - 1;

  async function saveDraft() {
    setStatus("saving");
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/kartlegging/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getValues()),
      });
      if (!res.ok) throw new Error("Kunne ikke lagre utkast. Prøv igjen.");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Ukjent feil.");
    }
  }

  async function onSubmitFinal(data: AssessmentInput) {
    setStatus("saving");
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/kartlegging/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submit: true }),
      });
      if (!res.ok) throw new Error("Kunne ikke sende inn kartleggingen. Prøv igjen.");
      router.push("/portal/rapport");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Ukjent feil.");
    }
  }

  const step = steps[currentStep];
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <form onSubmit={handleSubmit(onSubmitFinal)} noValidate>
      {/* Progressbar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            Steg {currentStep + 1} av {steps.length}
          </span>
          <span>{progress} %</span>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-growth transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-brand-dark">{step.title}</h2>

      <div className="mt-6 space-y-5">
        {step.fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea id={field.name} rows={3} className="input mt-1" {...register(field.name as never)} />
            ) : (
              <input
                id={field.name}
                type={field.type === "number" ? "number" : "text"}
                step={field.type === "number" ? "any" : undefined}
                className="input mt-1"
                {...register(field.name as never)}
              />
            )}
          </div>
        ))}
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-brand-dark disabled:opacity-40"
          >
            Tilbake
          </button>
          {!isLastStep && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light"
            >
              Neste
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={saveDraft}
            disabled={status === "saving"}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-brand-dark disabled:opacity-60"
          >
            {status === "saving" ? "Lagrer..." : "Lagre og fortsett senere"}
          </button>
          {isLastStep && (
            <button
              type="submit"
              disabled={status === "saving"}
              className="rounded-xl bg-growth px-5 py-2.5 text-sm font-semibold text-white hover:bg-growth-light disabled:opacity-60"
            >
              Send inn kartlegging
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

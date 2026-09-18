"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { SITE_NAME } from "@/lib/content/site";

export function LeadForm({ variant = "kontakt" }: { variant?: "kontakt" | "bestill-samtale" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
  });

  async function onSubmit(data: LeadInput) {
    setStatus("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Noe gikk galt. Prøv igjen om litt.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Ukjent feil.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-growth/30 bg-growth/5 p-6 text-growth">
        <p className="font-semibold">Takk! Vi har mottatt henvendelsen din.</p>
        <p className="mt-1 text-sm text-growth-light">
          Vi tar kontakt så snart som mulig for å avtale et passende tidspunkt.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot-felt — skjult for mennesker, fanger enkle spam-boter */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">La stå tomt</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Navn" htmlFor="name" error={errors.name?.message}>
          <input id="name" className="input" {...register("name")} />
        </Field>
        <Field label="Virksomhetsnavn" htmlFor="businessName" error={errors.businessName?.message}>
          <input id="businessName" className="input" {...register("businessName")} />
        </Field>
        <Field label="E-post" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className="input" {...register("email")} />
        </Field>
        <Field label="Telefon" htmlFor="phone" error={errors.phone?.message}>
          <input id="phone" type="tel" className="input" {...register("phone")} />
        </Field>
        <Field label="Type virksomhet" htmlFor="businessType" optional>
          <input id="businessType" className="input" {...register("businessType")} />
        </Field>
        <Field label="Antall ansatte" htmlFor="employeeCount" optional>
          <input id="employeeCount" className="input" {...register("employeeCount")} />
        </Field>
      </div>

      <Field label="Største utfordring akkurat nå" htmlFor="biggestChallenge" optional>
        <textarea id="biggestChallenge" rows={3} className="input" {...register("biggestChallenge")} />
      </Field>

      {variant === "bestill-samtale" && (
        <Field label="Ønsket tidspunkt for samtale" htmlFor="preferredTime" optional>
          <input
            id="preferredTime"
            placeholder="F.eks. «tirsdager etter kl. 14» eller en konkret dato"
            className="input"
            {...register("preferredTime")}
          />
        </Field>
      )}

      <Field label="Melding" htmlFor="message" optional>
        <textarea id="message" rows={3} className="input" {...register("message")} />
      </Field>

      <div className="flex items-start gap-3">
        <input
          id="consentGiven"
          type="checkbox"
          className="mt-1 h-4 w-4"
          {...register("consentGiven")}
        />
        <label htmlFor="consentGiven" className="text-sm text-slate-600">
          Jeg samtykker til å bli kontaktet av {SITE_NAME} om min henvendelse.
        </label>
      </div>
      {errors.consentGiven && (
        <p className="text-sm text-red-600" role="alert">
          {errors.consentGiven.message}
        </p>
      )}

      {status === "error" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-growth px-6 py-3 text-sm font-semibold text-white hover:bg-growth-light disabled:opacity-60"
      >
        {status === "sending" ? "Sender..." : "Send inn"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label} {optional && <span className="text-slate-400">(valgfritt)</span>}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

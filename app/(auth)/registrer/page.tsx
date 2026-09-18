import { RegisterForm } from "@/components/register-form";

export const metadata = { title: "Registrer deg" };

export default function RegistrerPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-bold text-brand-dark">Opprett kundekonto</h1>
      <p className="mt-2 text-sm text-slate-600">
        Etter kartleggingssamtalen kan du opprette en konto for å fylle ut kartleggingen og se resultatene dine.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </main>
  );
}

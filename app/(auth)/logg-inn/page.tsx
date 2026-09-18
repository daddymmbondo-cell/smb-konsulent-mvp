import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Logg inn" };

export default function LoggInnPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-bold text-brand-dark">Logg inn</h1>
      <div className="mt-6">
        <LoginForm />
      </div>
    </main>
  );
}

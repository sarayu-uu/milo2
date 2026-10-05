import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/server/adminAuth";
import { LoginForm } from "./LoginForm";

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-paper p-8 shadow-[var(--shadow-paper)]">
        <h1 className="font-display text-3xl text-ink">Milomi admin</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-ink-soft">
            Set <code className="rounded bg-cream px-1">ADMIN_PASSWORD</code> (at least 8 characters) in <code className="rounded bg-cream px-1">.env.local</code> and in
            Vercel, then restart the server.
          </p>
        )}
      </div>
    </main>
  );
}

"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="font-bold text-ink">Password</span>
        <input name="password" type="password" required autoFocus autoComplete="current-password" className="rounded-lg border-2 border-paper-shade bg-cream px-3 py-2 text-base" />
      </label>
      {error && <p className="text-brick">{error}</p>}
      <button type="submit" disabled={pending} className="mt-2 min-h-[48px] rounded-full bg-moss px-6 font-bold text-paper disabled:opacity-60">
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}

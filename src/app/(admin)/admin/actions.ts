"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, passwordMatches, sessionToken } from "@/lib/server/adminAuth";

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const attempt = String(form.get("password") ?? "");
  if (!passwordMatches(attempt)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return "That password isn't right.";
  }
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

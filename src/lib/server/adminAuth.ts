import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Password protection for /admin (just for the Milomi team).
 * Set ADMIN_PASSWORD in the environment. The cookie holds a signature of
 * the password, so changing the password signs everyone out.
 */
export const ADMIN_COOKIE = "milomi_admin";

const password = () => process.env.ADMIN_PASSWORD ?? "";
export const adminConfigured = () => password().length >= 8;

const token = () => createHmac("sha256", password()).update("milomi-admin-session-v1").digest("hex");

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function passwordMatches(attempt: string) {
  return adminConfigured() && same(attempt, password());
}

export function sessionToken() {
  return token();
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!c && same(c, token());
}

/** Use at the top of every admin page and route. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

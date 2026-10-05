import "server-only";

/**
 * Minimal Supabase REST client for the server (no SDK needed).
 * Needs SUPABASE_URL and SUPABASE_SECRET_KEY (or the legacy
 * SUPABASE_SERVICE_ROLE_KEY). Never expose these to the browser.
 */
const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && key);

function headers(): Record<string, string> {
  const h: Record<string, string> = { apikey: key!, "Content-Type": "application/json" };
  // new keys (sb_secret_…) go on `apikey` only; legacy service_role keys are JWTs and also need Authorization
  if (!key!.startsWith("sb_")) h.Authorization = `Bearer ${key}`;
  return h;
}

/** Read rows, e.g. selectRows("feedback", "select=*&order=created_at.desc&limit=1000"). */
export async function selectRows<T = Record<string, unknown>>(table: string, query: string): Promise<T[]> {
  if (!supabaseConfigured) throw new Error("Supabase is not configured");
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`Supabase read from ${table} failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T[];
}

/** Insert one row; a repeat of the same unique id is ignored (safe retries). */
export async function insertRow(table: string, row: Record<string, unknown>, onConflict?: string): Promise<void> {
  if (!supabaseConfigured) throw new Error("Supabase is not configured");
  const q = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : "";
  const res = await fetch(`${url}/rest/v1/${table}${q}`, {
    method: "POST",
    headers: { ...headers(), Prefer: `return=minimal${onConflict ? ",resolution=ignore-duplicates" : ""}` },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase insert into ${table} failed (${res.status}): ${await res.text()}`);
}

import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/adminAuth";
import { selectRows, supabaseConfigured } from "@/lib/server/supabase";
import { SURVEY } from "@/features/feedback/survey";
import type { FeedbackRow } from "../page";

export const dynamic = "force-dynamic";

/** GET /admin/export?source=&activity=&mood= → feedback as a CSV file (admins only). */
export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured) return NextResponse.json({ ok: false, error: "Supabase is not configured" }, { status: 503 });

  const p = new URL(req.url).searchParams;
  const rows = (await selectRows<FeedbackRow>("feedback", "select=*&order=created_at.desc&limit=10000")).filter(
    (f) => (!p.get("source") || f.source === p.get("source")) && (!p.get("activity") || f.activity_id === p.get("activity")) && (!p.get("mood") || f.mood === p.get("mood")),
  );

  const surveyCols = SURVEY.map((q) => q.id);
  const head = ["created_at", "source", "activity_id", "mood", "noticed", "note", ...surveyCols, "app_version", "response_id"];
  const cell = (v: unknown) => {
    const s = v == null ? "" : String(v);
    // quote, and stop spreadsheet formula injection
    return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  const lines = [
    head.join(","),
    ...rows.map((f) =>
      [f.created_at, f.source, f.activity_id, f.mood, (f.noticed ?? []).join("; "), f.note, ...surveyCols.map((c) => f.answers?.[c]), f.app_version, f.response_id]
        .map(cell)
        .join(","),
    ),
  ];

  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="milomi-feedback-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

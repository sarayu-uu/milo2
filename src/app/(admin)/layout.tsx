import type { Metadata } from "next";
import { Andika, Fredoka } from "next/font/google";
import "@/styles/globals.css";

const andika = Andika({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-andika", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fredoka", display: "swap" });

export const metadata: Metadata = {
  title: "Milomi admin",
  robots: { index: false, follow: false },
};

/** The team's admin area: a plain, scrollable page outside the children's app shell (no analytics, no sound). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${andika.variable} ${fredoka.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}

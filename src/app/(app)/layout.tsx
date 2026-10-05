import type { Metadata, Viewport } from "next";
import { Andika, Fredoka, Patrick_Hand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
import { AppShell } from "@/components/ui/AppShell";
import { LandscapeViewport } from "@/components/ui/LandscapeViewport";

const andika = Andika({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-andika", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-fredoka", display: "swap" });
const patrick = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-patrick", display: "swap" });

export const metadata: Metadata = {
  title: "Milomi",
  description: "A calm, funny scrapbook world where a slightly confused pigeon and your child figure things out together.",
  applicationName: "Milomi",
  appleWebApp: { capable: true, title: "Milomi", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f6efe1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${andika.variable} ${fredoka.variable} ${patrick.variable}`}>
      <body>
        <LandscapeViewport>
          <AppShell>{children}</AppShell>
          <Analytics />
        </LandscapeViewport>
      </body>
    </html>
  );
}

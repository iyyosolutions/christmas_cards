import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Snowfall } from "@/components/snowfall";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Hearth & Holly — Christmas cards",
  description: "Create a personal Christmas card and share it with someone you love.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} ${script.variable} h-full antialiased`}>
      <body className="paper-grid min-h-full">
        <Snowfall />
        <SiteHeader />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

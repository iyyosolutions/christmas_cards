import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { cormorantFont, displayFont, outfitFont, scriptFont } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Send A Wish — Christmas cards",
  description: "Create a personal Christmas card and share it with someone you love.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfitFont.variable} ${cormorantFont.variable} ${scriptFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="min-h-full pb-14">
        <div className="notebook relative mx-2 my-3 min-h-[calc(100vh-5.5rem)] max-w-5xl overflow-hidden rounded-2xl border border-black/10 sm:mx-auto sm:my-6 sm:rounded-[28px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-3 overflow-hidden pt-1.5 sm:gap-6 sm:pt-2" aria-hidden>
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} className="h-6 w-2.5 shrink-0 rounded-b-full border-2 border-[#8d8680] bg-[#d9d4cc] shadow-inner sm:h-7 sm:w-3" />
            ))}
          </div>
          <SiteHeader />
          <main className="relative z-10 px-4 pb-10 pt-2 sm:px-10">{children}</main>
        </div>
        <a
          href="https://iyyosolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="tape fixed inset-x-0 bottom-0 z-40 flex h-11 items-center justify-center px-3 text-center text-xs font-medium tracking-wide text-[#1f3d3a] sm:text-sm"
        >
          Designed &amp; Developed by IYYO SOLUTIONS
        </a>
      </body>
    </html>
  );
}

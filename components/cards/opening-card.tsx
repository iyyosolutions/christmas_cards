"use client";

import { useEffect, useState } from "react";
import { GreetingCard } from "@/components/cards/greeting-card";
import type { CardDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OpeningCard({
  draft,
  auto = false,
}: {
  draft: CardDraft;
  auto?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setOpen(true), reduced ? 0 : 500);
    return () => window.clearTimeout(timer);
  }, [auto]);

  const greeting = draft.recipientName.trim() ? `Dear ${draft.recipientName.trim()},` : "";
  const wishes = (draft.wishes ?? []).filter((wish) => wish.message.trim());
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = draft.senderName.trim() || "With love";
  const font =
    draft.style?.fontStyle === "sans" ? "font-sans" : draft.style?.fontStyle === "script" ? "[font-family:var(--font-script)]" : "font-serif";
  const align = draft.style?.textAlign === "center" ? "text-center" : "text-left";
  const color = draft.style?.textColor;

  return (
    <div className="w-full [perspective:1400px]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="relative block aspect-[3/4] w-full cursor-pointer text-left"
      >
        <div className={cn("absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[28px] bg-[#fff9f0] px-4 py-5 shadow-[0_18px_40px_rgba(18,61,43,0.12)] sm:px-7 sm:py-8", align)}>
          {draft.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.photoUrl} alt="" className="mb-3 max-h-28 w-full rounded-xl object-cover" />
          ) : null}
          {greeting ? <p className={cn("text-3xl leading-none text-[#123d2b]", font)} style={color ? { color } : undefined}>{greeting}</p> : <span />}
          {wishes.length > 0 ? (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
              {wishes.map((wish, index) => (
                <div key={`${wish.senderName}-${index}`}>
                  <p className={cn("text-base leading-snug text-[#241c16]/85", font)} style={color ? { color } : undefined}>{wish.message}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#c62828]">{wish.senderName.trim() || "With love"}</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className={cn("text-xl leading-snug text-[#241c16]/85", font)} style={color ? { color } : undefined}>{message}</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#c62828]">{sender}</p>
            </>
          )}
        </div>
        <div
          className={cn(
            "absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d]",
            open ? "[transform:rotateY(-168deg)]" : "[transform:rotateY(0deg)]",
          )}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <GreetingCard draft={draft} />
          </div>
          <div className="absolute inset-0 rounded-[28px] border border-[#d4af65]/40 bg-[#f4efe4] [transform:rotateY(180deg)] [backface-visibility:hidden]" />
        </div>
      </button>
      <p className="mt-2 text-center text-xs text-ink/45">{open ? "Click to close" : "Click to open"}</p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CardDraft } from "@/lib/types";

const corners = [
  { key: "tl", className: "top-0 left-0", img: "top-0 left-0", open: { x: "-110%", y: "-110%" } },
  { key: "tr", className: "top-0 right-0", img: "top-0 right-0", open: { x: "110%", y: "-110%" } },
  { key: "bl", className: "bottom-0 left-0", img: "bottom-0 left-0", open: { x: "-110%", y: "110%" } },
  { key: "br", className: "bottom-0 right-0", img: "bottom-0 right-0", open: { x: "110%", y: "110%" } },
] as const;

export function RibbonPull({ draft }: { draft: CardDraft }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setReady(true);
    }, reduced ? 0 : 500);
    return () => window.clearTimeout(timer);
  }, []);

  const greeting = draft.recipientName.trim() ? `Dear ${draft.recipientName.trim()},` : "";
  const wishes = (draft.wishes ?? []).filter((wish) => wish.message.trim());
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = draft.senderName.trim() || "With love";

  return (
    <div className="mx-auto w-full max-w-sm">
      <button
        type="button"
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[#f3eadc]"
        onClick={() => ready && setOpen((value) => !value)}
        aria-label={open ? "Close the card" : "Open the card"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/designs/ribbon-tree-back.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-[16%] top-[16%] bottom-[16%] flex flex-col items-center justify-center overflow-hidden px-2 text-center text-[#1f4a32]">
          {draft.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.photoUrl} alt="" className="mb-2 max-h-16 w-full rounded-lg object-cover" />
          ) : null}
          {greeting ? <p className="font-serif text-xl">{greeting}</p> : null}
          {wishes.length > 0 ? (
            wishes.map((wish, index) => (
              <div key={`${wish.senderName}-${index}`} className="mt-2">
                <p className="font-serif text-sm leading-snug">{wish.message}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em]">{wish.senderName.trim() || "With love"}</p>
              </div>
            ))
          ) : (
            <>
              <p className="font-serif text-base leading-snug">{message}</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em]">{sender}</p>
            </>
          )}
        </div>
        {corners.map((corner, index) => (
          <motion.div
            key={corner.key}
            className={`absolute h-1/2 w-1/2 overflow-hidden ${corner.className}`}
            animate={open ? corner.open : { x: "0%", y: "0%" }}
            transition={{ duration: 0.85, delay: open ? index * 0.05 : 0, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/designs/ribbon-tree-front.png"
              alt=""
              className={`absolute h-[200%] w-[200%] max-w-none object-cover ${corner.img}`}
            />
          </motion.div>
        ))}
      </button>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">{open ? "Tap the card to close it" : "Tap the card to open it"}</p>}
    </div>
  );
}

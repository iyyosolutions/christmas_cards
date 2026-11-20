"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CardDraft } from "@/lib/types";

export function SantaLift({ draft }: { draft: CardDraft }) {
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
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[#f7f1e6]"
        onClick={() => ready && setOpen((value) => !value)}
        aria-label={open ? "Close the card" : "Open the card"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/designs/santa-back.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-[10%] top-[18%] bottom-[18%] flex flex-col items-center justify-center overflow-hidden px-2 text-center text-[#1f4a32]">
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
        <div className="pointer-events-none absolute inset-0" style={{ perspective: 1400 }}>
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
            animate={open ? { rotateY: -160, x: "8%" } : { rotateY: 0, x: "0%" }}
            transition={{ duration: 0.95, ease: [0.45, 0.02, 0.25, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designs/santa-front.jpg" alt="" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0 bg-black/20"
              style={{ opacity: open ? 1 : 0, transition: "opacity 0.6s" }}
            />
          </motion.div>
        </div>
      </button>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">{open ? "Tap the card to close it" : "Tap the card to open it"}</p>}
    </div>
  );
}

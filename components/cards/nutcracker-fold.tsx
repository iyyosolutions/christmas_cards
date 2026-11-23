"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WishSteps } from "@/components/cards/wish-steps";
import type { CardDraft } from "@/lib/types";

export function NutcrackerFold({ draft }: { draft: CardDraft }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setReady(true);
    }, reduced ? 0 : 400);
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
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[#0e3a36]"
        onClick={() => ready && setOpen((value) => !value)}
        aria-label={open ? "Close the card" : "Open the card"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/designs/nutcracker-back.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-[16%] top-[18%] bottom-[18%] flex flex-col items-center justify-center overflow-hidden px-2 text-center text-[#f6f1e4]">
          {draft.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.photoUrl} alt="" className="mx-auto mb-2 h-14 w-14 rounded-md object-contain" />
          ) : null}
          {greeting ? <p className="font-serif text-xl">{greeting}</p> : null}
          {wishes.length > 0 ? (
            <WishSteps
              wishes={wishes}
              playing={open}
              messageClassName="font-serif text-sm leading-snug"
              senderClassName="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#f6f1e4]/75"
            />
          ) : (
            <>
              <p className="font-serif text-base leading-snug">{message}</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#f6f1e4]/75">{sender}</p>
            </>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ perspective: 1200 }}>
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
            style={{ transformOrigin: "left center" }}
            animate={{ rotateY: open ? -105 : 0 }}
            transition={{ duration: 0.85, ease: [0.45, 0.05, 0.2, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designs/nutcracker-front.png" alt="" className="absolute top-0 left-0 h-full w-[200%] max-w-none object-cover" />
            <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/25 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
            style={{ transformOrigin: "right center" }}
            animate={{ rotateY: open ? 105 : 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.45, 0.05, 0.2, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designs/nutcracker-front.png" alt="" className="absolute top-0 right-0 h-full w-[200%] max-w-none object-cover" />
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent" />
          </motion.div>
        </div>
      </button>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">{open ? "Tap the card to close it" : "Tap the card to open it"}</p>}
    </div>
  );
}

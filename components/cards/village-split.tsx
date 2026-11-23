"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WishSteps } from "@/components/cards/wish-steps";
import type { CardDraft } from "@/lib/types";

export function VillageSplit({ draft }: { draft: CardDraft }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setReady(true);
    }, reduced ? 0 : 550);
    return () => window.clearTimeout(timer);
  }, []);

  const greeting = draft.recipientName.trim() ? `Dear ${draft.recipientName.trim()},` : "";
  const wishes = (draft.wishes ?? []).filter((wish) => wish.message.trim());
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = draft.senderName.trim() || "With love";
  const flakes = Array.from({ length: 18 }, (_, index) => ({
    left: `${(index * 17) % 100}%`,
    size: 4 + (index % 4) * 2,
    delay: (index % 7) * 0.35,
    duration: 3.2 + (index % 5) * 0.45,
    drift: index % 2 === 0 ? 12 : -12,
  }));

  return (
    <div className="mx-auto w-full max-w-sm">
      <button
        type="button"
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[#d7e6f2]"
        onClick={() => ready && setOpen((value) => !value)}
        aria-label={open ? "Close the card" : "Open the card"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/designs/village-back.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-[14%] top-[18%] bottom-[34%] flex flex-col items-center justify-center overflow-hidden px-2 text-center text-[#5c3a32]">
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
              senderClassName="mt-1 text-[10px] uppercase tracking-[0.16em]"
            />
          ) : (
            <>
              <p className="font-serif text-base leading-snug">{message}</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em]">{sender}</p>
            </>
          )}
        </div>
        <motion.div
          className="absolute inset-x-0 top-0 h-[46%] overflow-hidden"
          animate={{ y: open ? "-100%" : "0%" }}
          transition={{ duration: 0.85, ease: [0.2, 0.75, 0.2, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/designs/village-front.png" alt="" className="absolute top-0 left-0 h-[217%] w-full max-w-none object-cover" />
        </motion.div>
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[54%] overflow-hidden"
          animate={{ y: open ? "100%" : "0%" }}
          transition={{ duration: 0.85, ease: [0.2, 0.75, 0.2, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/designs/village-front.png" alt="" className="absolute bottom-0 left-0 h-[185%] w-full max-w-none object-cover" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {flakes.map((flake, index) => (
            <motion.span
              key={index}
              className="absolute top-0 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              style={{ left: flake.left, width: flake.size, height: flake.size }}
              initial={{ y: "-8%", x: 0, opacity: 0.85 }}
              animate={{ y: "110%", x: flake.drift, opacity: [0.2, 0.95, 0.7] }}
              transition={{ duration: flake.duration, delay: flake.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      </button>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">{open ? "Tap the card to close it" : "Tap the card to open it"}</p>}
    </div>
  );
}

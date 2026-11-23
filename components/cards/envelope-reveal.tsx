"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GreetingCard } from "@/components/cards/greeting-card";
import { WishSteps } from "@/components/cards/wish-steps";
import type { CardDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EnvelopeReveal({ draft }: { draft: CardDraft }) {
  const [phase, setPhase] = useState<"closed" | "open" | "rise" | "away" | "flip">("closed");
  const [showInside, setShowInside] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("flip");
      setShowInside(true);
      setReady(true);
      return;
    }
    const steps: Array<["open" | "rise" | "away" | "flip", number]> = [
      ["open", 700],
      ["rise", 1600],
      ["away", 2600],
      ["flip", 3900],
    ];
    const timers = steps.map(([next, delay]) =>
      window.setTimeout(() => {
        setPhase(next);
        if (next === "flip") {
          setShowInside(true);
          setReady(true);
        }
      }, delay),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const greeting = draft.recipientName.trim() ? `Dear ${draft.recipientName.trim()},` : "";
  const wishes = (draft.wishes ?? []).filter((wish) => wish.message.trim());
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = draft.senderName.trim() || "With love";
  const flipped = showInside;
  const envelopeGone = phase === "away" || phase === "flip";

  const risen = phase === "rise" || phase === "away" || phase === "flip";
  const flapOpen = phase !== "closed";
  const envelopeMotion = envelopeGone
    ? { y: ["0%", "6%", "160%"], rotate: [0, -6, 18], scale: [1, 1.03, 0.8], opacity: [1, 1, 0] }
    : { y: "0%", rotate: 0, scale: 1, opacity: 1 };
  const envelopeTransition = envelopeGone
    ? { duration: 1.15, times: [0, 0.18, 1], ease: [0.55, 0.05, 0.9, 0.35] }
    : { duration: 0.4 };

  return (
    <div className="mx-auto w-full max-w-sm">
    <div className="relative aspect-[3/4] w-full [perspective:1400px]">
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 origin-bottom"
        animate={envelopeMotion}
        transition={envelopeTransition}
      >
        <div className="absolute inset-0 rounded-[18px] bg-[#f6efe4] shadow-[0_16px_30px_rgba(40,30,20,0.16)]" />
      </motion.div>

      <div className="absolute inset-0 z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ y: "72%" }}
          animate={{ y: risen ? "0%" : "72%" }}
          transition={{ duration: 1.05, ease: [0.2, 0.75, 0.2, 1] }}
        >
          <button
            type="button"
            disabled={!ready}
            onClick={() => ready && setShowInside((open) => !open)}
            className={cn("relative block h-full w-full [transform-style:preserve-3d] transition-transform duration-700", flipped && "[transform:rotateY(180deg)]")}
            aria-label={showInside ? "Close the card" : "Open the card"}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[18px] [backface-visibility:hidden]">
              <GreetingCard draft={draft} className="rounded-[18px] shadow-none" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[18px] bg-[#fffaf2] px-5 py-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
              {draft.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.photoUrl} alt="" className="mb-3 h-16 w-16 rounded-md object-contain" />
              ) : null}
              {greeting ? <p className="font-serif text-2xl text-[#7a2430]">{greeting}</p> : <span />}
              {wishes.length > 0 ? (
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
                  <WishSteps
                    wishes={wishes}
                    playing={showInside}
                    messageClassName="font-serif text-base leading-snug text-[#2c2824]"
                    senderClassName="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#7a2430]"
                  />
                </div>
              ) : (
                <>
                  <p className="font-serif text-lg leading-snug text-[#2c2824]">{message}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#7a2430]">{sender}</p>
                </>
              )}
            </div>
          </button>
        </motion.div>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 origin-bottom"
        animate={envelopeMotion}
        transition={envelopeTransition}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-[70%] bg-[#efe3d0]"
          style={{ clipPath: "polygon(0 16%, 50% 0, 100% 16%, 100% 100%, 0 100%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 z-20 h-[70%] rounded-b-[18px] border border-[#e2d3bc]" />
        <motion.div
          className={cn("absolute inset-x-0 top-0 h-[58%] origin-top bg-[#e7d8c4]", flapOpen ? "z-0" : "z-30")}
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 92%)" }}
          animate={{ rotateX: flapOpen ? -170 : 0 }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute left-1/2 top-[46%] z-30 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#8d2c3b]" />
      </motion.div>
    </div>
    {ready && <p className="mt-3 text-center text-xs text-ink/50">{showInside ? "Tap the card to close it" : "Tap the card to open it"}</p>}
    </div>
  );
}

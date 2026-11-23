"use client";

import { signOff } from "@/lib/sign-off";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GreetingCard } from "@/components/cards/greeting-card";
import { WishSteps } from "@/components/cards/wish-steps";
import type { CardDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RollReveal({ draft }: { draft: CardDraft }) {
  const [phase, setPhase] = useState<"rolled" | "front" | "back">("rolled");
  const [showBack, setShowBack] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("back");
      setShowBack(true);
      setReady(true);
      return;
    }
    const open = window.setTimeout(() => setPhase("front"), 250);
    const flip = window.setTimeout(() => {
      setPhase("back");
      setShowBack(true);
      setReady(true);
    }, 1900);
    return () => {
      window.clearTimeout(open);
      window.clearTimeout(flip);
    };
  }, []);

  const greeting = draft.recipientName.trim() ? `Dear ${draft.recipientName.trim()},` : "";
  const wishes = (draft.wishes ?? []).filter((wish) => wish.message.trim());
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = signOff(draft.senderName);
  const rolled = phase === "rolled";

  return (
    <div className="mx-auto w-full max-w-sm">
    <div className="relative aspect-[3/4] w-full [perspective:1400px]">
      <motion.button
        type="button"
        disabled={!ready}
        onClick={() => ready && setShowBack((side) => !side)}
        aria-label="Flip the card"
        className="block h-full w-full origin-top [transform-style:preserve-3d]"
        initial={{ scaleY: 0.045, borderRadius: 999 }}
        animate={
          rolled
            ? { scaleY: 0.045, rotateY: 0 }
            : { scaleY: 1, rotateY: showBack ? 180 : 0 }
        }
        transition={rolled ? { duration: 0.2 } : { duration: phase === "front" ? 1.15 : 0.9, ease: [0.16, 0.84, 0.24, 1] }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[18px] shadow-[0_16px_30px_rgba(40,30,20,0.16)] [backface-visibility:hidden]">
          <GreetingCard draft={draft} className="rounded-[18px] shadow-none" />
        </div>
        <div className={cn("absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[18px] bg-[#fffaf2] px-5 py-6 [transform:rotateY(180deg)] [backface-visibility:hidden]")}>
          {draft.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.photoUrl} alt="" className="mb-3 h-16 w-16 rounded-md object-contain" />
          ) : null}
          {greeting ? <p className="font-serif text-2xl text-[#7a2430]">{greeting}</p> : <span />}
          {wishes.length > 0 ? (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
              <WishSteps
                wishes={wishes}
                playing={showBack}
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
      </motion.button>
    </div>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">Tap the card to flip it</p>}
    </div>
  );
}

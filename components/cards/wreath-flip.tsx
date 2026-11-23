"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WishSteps } from "@/components/cards/wish-steps";
import type { CardDraft } from "@/lib/types";

export function WreathFlip({ draft }: { draft: CardDraft }) {
  const [showBack, setShowBack] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setShowBack(true);
      setReady(true);
    }, reduced ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, []);

  const greeting = draft.recipientName.trim() ? `Dear ${draft.recipientName.trim()},` : "";
  const wishes = (draft.wishes ?? []).filter((wish) => wish.message.trim());
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = draft.senderName.trim() || "With love";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-[3/4] w-full [perspective:1400px]">
        <motion.button
          type="button"
          className="relative block h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: showBack ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          onClick={() => ready && setShowBack((side) => !side)}
          aria-label="Flip the card"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[18px] [backface-visibility:hidden]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designs/wreath-front.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-[18px] [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designs/wreath-back.png" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-[18%] top-[22%] bottom-[20%] flex flex-col justify-center overflow-hidden px-2 text-center text-[#7a2430]">
              {draft.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.photoUrl} alt="" className="mx-auto mb-2 h-14 w-14 rounded-md object-contain" />
              ) : null}
              {greeting ? <p className="font-serif text-xl">{greeting}</p> : null}
              {wishes.length > 0 ? (
                <WishSteps
                  wishes={wishes}
                  playing={showBack}
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
          </div>
        </motion.button>
      </div>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">Tap the card to flip it</p>}
    </div>
  );
}

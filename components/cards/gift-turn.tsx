"use client";

import { signOff } from "@/lib/sign-off";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WishSteps } from "@/components/cards/wish-steps";
import type { CardDraft } from "@/lib/types";

export function GiftTurn({ draft }: { draft: CardDraft }) {
  const [landed, setLanded] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLanded(true);
      setShowBack(true);
      setReady(true);
      return;
    }
    const land = window.setTimeout(() => setLanded(true), 40);
    const turn = window.setTimeout(() => {
      setShowBack(true);
      setReady(true);
    }, 1500);
    return () => {
      window.clearTimeout(land);
      window.clearTimeout(turn);
    };
  }, []);

  const greeting = draft.recipientName.trim() ? `Dear ${draft.recipientName.trim()},` : "";
  const wishes = (draft.wishes ?? []).filter((wish) => wish.message.trim());
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = signOff(draft.senderName);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-[3/4] w-full [perspective:1400px]">
        <motion.button
          type="button"
          className="relative block h-full w-full origin-center [transform-style:preserve-3d]"
          initial={{ y: "-40%", rotate: -8, scale: 0.92 }}
          animate={{
            y: "0%",
            rotate: landed ? 0 : -8,
            scale: showBack ? 0.92 : 1,
            rotateX: showBack ? 180 : 0,
          }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          onClick={() => ready && setShowBack((side) => !side)}
          aria-label="Turn the card over"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[18px] shadow-[0_16px_30px_rgba(40,30,20,0.16)] [backface-visibility:hidden]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designs/gift-front.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-[18px] [transform:rotateX(180deg)] [backface-visibility:hidden]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designs/gift-back.png" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-[14%] top-[28%] bottom-[24%] flex flex-col items-center justify-center overflow-hidden text-center text-[#7a2430]">
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
      {ready && <p className="mt-3 text-center text-xs text-ink/50">Tap the card to turn it over</p>}
    </div>
  );
}

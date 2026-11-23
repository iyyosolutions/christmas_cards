"use client";

import { signOff } from "@/lib/sign-off";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WishSteps } from "@/components/cards/wish-steps";
import type { CardDraft } from "@/lib/types";

export function NightLift({ draft }: { draft: CardDraft }) {
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
  const sender = signOff(draft.senderName);

  return (
    <div className="mx-auto w-full max-w-sm">
      <button
        type="button"
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[#12324d]"
        onClick={() => ready && setOpen((value) => !value)}
        aria-label={open ? "Close the card" : "Open the card"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/designs/night-street-back.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-[12%] top-[22%] bottom-[22%] flex flex-col items-center justify-center overflow-hidden px-2 text-center text-[#f4efe4]">
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
              senderClassName="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#f4efe4]/75"
            />
          ) : (
            <>
              <p className="font-serif text-base leading-snug">{message}</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#f4efe4]/75">{sender}</p>
            </>
          )}
        </div>
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: "bottom center" }}
          animate={open ? { y: "-108%", rotate: -7, opacity: 0.4 } : { y: "0%", rotate: 0, opacity: 1 }}
          transition={{ duration: 0.95, ease: [0.22, 0.7, 0.2, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/designs/night-street-front.png" alt="" className="h-full w-full object-cover" />
        </motion.div>
      </button>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">{open ? "Tap the card to close it" : "Tap the card to open it"}</p>}
    </div>
  );
}

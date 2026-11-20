"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CardDraft } from "@/lib/types";

const tiles = Array.from({ length: 12 }, (_, index) => ({
  col: index % 3,
  row: Math.floor(index / 3),
}));

export function FlakeTiles({ draft }: { draft: CardDraft }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setReady(true);
    }, reduced ? 0 : 300);
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
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[#e7e2da]"
        onClick={() => ready && setOpen((value) => !value)}
        aria-label={open ? "Close the card" : "Open the card"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/designs/flake-grid-back.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-[8%] bottom-[4%] top-[76%] flex flex-col items-center justify-center overflow-hidden px-2 text-center text-[#9b2d3a]">
          {draft.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.photoUrl} alt="" className="mb-1 max-h-10 w-full rounded-lg object-cover" />
          ) : null}
          {greeting ? <p className="font-serif text-lg leading-none">{greeting}</p> : null}
          {wishes.length > 0 ? (
            wishes.map((wish, index) => (
              <div key={`${wish.senderName}-${index}`} className="mt-1">
                <p className="font-serif text-xs leading-snug">{wish.message}</p>
                <p className="text-[9px] uppercase tracking-[0.16em]">{wish.senderName.trim() || "With love"}</p>
              </div>
            ))
          ) : (
            <>
              <p className="font-serif text-sm leading-snug">{message}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.18em]">{sender}</p>
            </>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ perspective: 900 }}>
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              className="absolute overflow-hidden"
              style={{
                left: `${tile.col * 33.333}%`,
                top: `${tile.row * 25}%`,
                width: "33.333%",
                height: "25%",
                transformOrigin: "center",
              }}
              animate={{ rotateY: open ? 180 : 0, opacity: open ? 0 : 1 }}
              transition={{ duration: 0.45, delay: open ? index * 0.06 : (11 - index) * 0.04, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/designs/flake-grid-front.jpg"
                alt=""
                className="absolute max-w-none object-cover"
                style={{ width: "300%", height: "400%", left: `${-tile.col * 100}%`, top: `${-tile.row * 100}%` }}
              />
            </motion.div>
          ))}
        </div>
      </button>
      {ready && <p className="mt-3 text-center text-xs text-ink/50">{open ? "Tap the card to close it" : "Tap the card to open it"}</p>}
    </div>
  );
}

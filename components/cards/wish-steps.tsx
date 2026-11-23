"use client";

import { signOff } from "@/lib/sign-off";
import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CardWish } from "@/lib/types";

export function WishSteps({
  wishes,
  playing,
  messageClassName,
  senderClassName,
  messageStyle,
}: {
  wishes: CardWish[];
  playing: boolean;
  messageClassName: string;
  senderClassName: string;
  messageStyle?: CSSProperties;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!playing) {
      setIndex(0);
      return;
    }
    if (wishes.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % wishes.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [playing, wishes.length]);

  const wish = wishes[index];
  if (!wish) return null;

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${wish.senderName}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          <p className={messageClassName} style={messageStyle}>
            {wish.message}
          </p>
          <p className={senderClassName}>{signOff(wish.senderName)}</p>
        </motion.div>
      </AnimatePresence>
      {wishes.length > 1 ? (
        <p className={`${senderClassName} mt-2`}>
          {index + 1} of {wishes.length}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GreetingCard } from "@/components/cards/greeting-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CardDraft } from "@/lib/types";

export function PublicCardView({
  draft,
  imageUrl,
  senderName,
  recipientName,
}: {
  draft: CardDraft;
  imageUrl: string | null;
  senderName: string;
  recipientName: string | null;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {imageUrl ? (
          // The stored PNG is the generated card, artwork included.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={`Christmas card from ${senderName}`} className="w-full rounded-[28px] shadow-[0_24px_60px_rgba(20,24,18,0.22)]" />
        ) : (
          <GreetingCard draft={draft} />
        )}
      </motion.div>
      <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="text-xs uppercase tracking-[0.22em] text-berry">From {senderName}</p>
        <h1 className="mt-2 font-serif text-4xl text-pine-deep sm:text-5xl">
          {recipientName ? `For ${recipientName}` : "A Christmas wish"}
        </h1>
        <p className="mt-4 font-serif text-xl leading-snug text-ink/80">{draft.message}</p>
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          Create Your Own Christmas Card
        </Link>
      </motion.div>
    </div>
  );
}

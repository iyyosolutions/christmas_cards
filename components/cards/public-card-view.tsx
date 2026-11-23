"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { EnvelopeReveal } from "@/components/cards/envelope-reveal";
import { OpeningCard } from "@/components/cards/opening-card";
import { GiftTurn } from "@/components/cards/gift-turn";
import { GnomeReveal } from "@/components/cards/gnome-reveal";
import { SantaLift } from "@/components/cards/santa-lift";
import { SnowSpin } from "@/components/cards/snow-spin";
import { VillageSplit } from "@/components/cards/village-split";
import { NightLift } from "@/components/cards/night-lift";
import { ReindeerIris } from "@/components/cards/reindeer-iris";
import { NutcrackerFold } from "@/components/cards/nutcracker-fold";
import { FlakeTiles } from "@/components/cards/flake-tiles";
import { CozyDrop } from "@/components/cards/cozy-drop";
import { WreathFlip } from "@/components/cards/wreath-flip";
import { classicOpenIds } from "@/lib/templates";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CardDraft } from "@/lib/types";
import { signOff } from "@/lib/sign-off";

export function PublicCardView({
  draft,
  senderName,
  recipientName,
}: {
  draft: CardDraft;
  imageUrl: string | null;
  senderName: string;
  recipientName: string | null;
}) {
  return (
    <div className="mx-auto max-w-lg py-4 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {draft.templateId === "cozy-bear" ? (
          <CozyDrop draft={draft} />
        ) : draft.templateId === "flake-grid" ? (
          <FlakeTiles draft={draft} />
        ) : draft.templateId === "nutcracker" ? (
          <NutcrackerFold draft={draft} />
        ) : draft.templateId === "reindeer-pair" ? (
          <ReindeerIris draft={draft} />
        ) : draft.templateId === "night-street" ? (
          <NightLift draft={draft} />
        ) : draft.templateId === "snow-village" ? (
          <VillageSplit draft={draft} />
        ) : draft.templateId === "gold-snow" ? (
          <SnowSpin draft={draft} />
        ) : draft.templateId === "watercolor-santa" ? (
          <SantaLift draft={draft} />
        ) : draft.templateId === "pine-gnome" ? (
          <GnomeReveal draft={draft} />
        ) : draft.templateId === "gift-box" ? (
          <GiftTurn draft={draft} />
        ) : draft.templateId === "ribbon-wreath" ? (
          <WreathFlip draft={draft} />
        ) : classicOpenIds.includes(draft.templateId) ? (
          <OpeningCard draft={draft} auto />
        ) : (
          <EnvelopeReveal draft={draft} />
        )}
      </motion.div>
      <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="text-xs uppercase tracking-[0.22em] text-berry">
          {signOff(senderName) === "Made with love" ? "Made with love" : `From ${signOff(senderName)}`}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-pine-deep sm:text-5xl">
          {recipientName ? `For ${recipientName}` : "A Christmas wish"}
        </h1>
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full sm:w-auto")}>
          Create Your Own Christmas Card
        </Link>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCard } from "@/app/actions/cards";
import { GreetingCard } from "@/components/cards/greeting-card";
import { Button, buttonVariants } from "@/components/ui/button";
import type { CardRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

export type DashboardCard = CardRecord & { imageUrl: string | null };

export function CardGrid({ cards }: { cards: DashboardCard[] }) {
  const router = useRouter();
  const [preview, setPreview] = useState<DashboardCard | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function copy(token: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/card/${token}`);
    setNote("Sharing link copied.");
  }

  async function download(card: DashboardCard) {
    if (!card.imageUrl) {
      setNote("This card does not have an image yet.");
      return;
    }
    const response = await fetch(card.imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${card.recipient_name || "christmas-card"}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function remove(card: DashboardCard) {
    const label = card.recipient_name ? `the card for ${card.recipient_name}` : "this card";
    if (!confirm(`Delete ${label}?`)) return;
    const result = await deleteCard(card.id);
    if (result.error) {
      setNote(result.error);
      return;
    }
    setPreview(null);
    router.refresh();
  }

  return (
    <>
      {note && <p className="mb-4 text-sm text-pine">{note}</p>}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.id} className="rounded-[28px] border border-ink/10 bg-cream/80 p-4">
            <button type="button" onClick={() => setPreview(card)} className="block w-full overflow-hidden rounded-2xl text-left">
              <Thumbnail card={card} />
            </button>
            <h3 className="mt-4 font-serif text-2xl text-pine">
              {card.recipient_name ? card.recipient_name : "General wish"}
            </h3>
            <p className="text-sm text-ink/50">{new Date(card.created_at).toLocaleDateString()}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setPreview(card)}>Preview</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => copy(card.share_token)}>Copy link</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => download(card)}>Download</Button>
              <Link href={`/share/${card.share_token}`} className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>Share again</Link>
              <Button type="button" size="sm" variant="ghost" onClick={() => remove(card)}>Delete</Button>
            </div>
          </article>
        ))}
      </div>
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-deep/70 p-4" role="dialog" aria-modal="true" aria-label="Card preview">
          <div className="w-full max-w-sm">
            <Thumbnail card={preview} large />
            <div className="mt-4 flex flex-wrap justify-between gap-2 text-cream">
              <p className="font-serif text-2xl">{preview.recipient_name ? `For ${preview.recipient_name}` : "General wish"}</p>
              <Button type="button" variant="outline" onClick={() => setPreview(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Thumbnail({ card, large }: { card: DashboardCard; large?: boolean }) {
  if (card.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={card.imageUrl} alt="" className={cn("w-full rounded-2xl object-cover", large ? "" : "aspect-[3/4]")} />
    );
  }
  return (
    <div className={large ? "" : "pointer-events-none"}>
      <GreetingCard
        draft={{
          templateId: card.template_id,
          recipientName: card.recipient_name ?? "",
          message: card.message,
          senderName: card.sender_name,
        }}
      />
    </div>
  );
}

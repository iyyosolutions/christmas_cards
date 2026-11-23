"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareDesk({
  slug,
  senderName,
  recipientName,
}: {
  slug: string;
  senderName: string;
  recipientName: string | null;
  imageUrl: string | null;
}) {
  const [note, setNote] = useState<string | null>(null);

  async function copy() {
    const url = `${window.location.origin}/card/${slug}`;
    await navigator.clipboard.writeText(url);
    setNote("Link copied.");
  }

  function shareUrl() {
    return `${window.location.origin}/card/${slug}`;
  }

  function shareText() {
    const who = recipientName ? ` for ${recipientName}` : "";
    return `A Christmas card${who}, from ${senderName}`;
  }

  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-4 rounded-[28px] border border-ink/10 bg-cream/90 p-3 sm:p-5">
      <div className="grid grid-cols-2 gap-2 [&>button]:w-full sm:flex sm:flex-wrap sm:[&>button]:w-auto">
        <Button type="button" variant="outline" size="sm" onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText()}: ${shareUrl()}`)}`)}>WhatsApp</Button>
        <Button type="button" variant="outline" size="sm" onClick={copy}>Copy link</Button>
      </div>
      {note && <p className="text-sm text-pine">{note}</p>}
    </div>
  );
}

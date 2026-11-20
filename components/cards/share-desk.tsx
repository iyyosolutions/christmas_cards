"use client";

import { useEffect, useState } from "react";
import { sendCardEmail } from "@/app/actions/cards";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

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
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [publicLink, setPublicLink] = useState(`/card/${slug}`);

  useEffect(() => {
    setPublicLink(`${window.location.origin}/card/${slug}`);
  }, [slug]);

  async function copy() {
    const url = `${window.location.origin}/card/${slug}`;
    await navigator.clipboard.writeText(url);
    setPublicLink(url);
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

  async function emailCard() {
    setPending(true);
    setNote(null);
    const result = await sendCardEmail({ slug, to: email });
    setPending(false);
    setNote(result.error ?? "Sent. They can open the card without an account.");
  }

  return (
    <div className="space-y-4 rounded-[28px] border border-ink/10 bg-cream/90 p-3 sm:p-5">
      <p className="break-all text-sm text-ink/70">{publicLink}</p>
      <div className="grid grid-cols-2 gap-2 [&>button]:w-full sm:flex sm:flex-wrap sm:[&>button]:w-auto">
        <Button type="button" variant="outline" size="sm" onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText()}: ${shareUrl()}`)}`)}>WhatsApp</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`)}>Facebook</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(shareUrl())}`)}>X</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => openShare(`https://t.me/share/url?url=${encodeURIComponent(shareUrl())}&text=${encodeURIComponent(shareText())}`)}>Telegram</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => openShare(`mailto:?subject=${encodeURIComponent(shareText())}&body=${encodeURIComponent(shareUrl())}`)}>Email</Button>
        <Button type="button" variant="outline" size="sm" onClick={copy}>Copy link</Button>
      </div>
      <div>
        <Label htmlFor="to">Email the card</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input id="to" type="email" value={email} placeholder="their@email.com" onChange={(event) => setEmail(event.target.value)} />
          <Button type="button" variant="berry" onClick={emailCard} disabled={pending || !email}>Send</Button>
        </div>
      </div>
      {note && <p className="text-sm text-pine">{note}</p>}
    </div>
  );
}

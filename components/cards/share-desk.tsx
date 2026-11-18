"use client";

import { useEffect, useState } from "react";
import { sendCardEmail } from "@/app/actions/cards";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function ShareDesk({
  slug,
  senderName,
  recipientName,
  imageUrl,
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

  function whatsapp() {
    const url = `${window.location.origin}/card/${slug}`;
    const who = recipientName ? ` for ${recipientName}` : "";
    const text = encodeURIComponent(`A Christmas card${who}, from ${senderName}: ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  async function emailCard() {
    setPending(true);
    setNote(null);
    const result = await sendCardEmail({ slug, to: email });
    setPending(false);
    setNote(result.error ?? "Sent. They can open the card without an account.");
  }

  async function download() {
    if (!imageUrl) {
      setNote("The image is not available yet.");
      return;
    }
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "christmas-card.png";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4 rounded-[28px] border border-ink/10 bg-cream/90 p-5">
      <p className="break-all text-sm text-ink/70">{publicLink}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={whatsapp}>WhatsApp</Button>
        <Button type="button" variant="outline" size="sm" onClick={copy}>Copy Link</Button>
        <Button type="button" variant="outline" size="sm" onClick={download}>Download PNG</Button>
      </div>
      <div>
        <Label htmlFor="to">Email the card</Label>
        <div className="flex gap-2">
          <Input id="to" type="email" value={email} placeholder="their@email.com" onChange={(event) => setEmail(event.target.value)} />
          <Button type="button" variant="berry" onClick={emailCard} disabled={pending || !email}>Send</Button>
        </div>
      </div>
      {note && <p className="text-sm text-pine">{note}</p>}
    </div>
  );
}

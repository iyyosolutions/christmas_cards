"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCard, sendCardEmail } from "@/app/actions/cards";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function SharePanel({ slug, canManage, cardId }: { slug: string; canManage: boolean; cardId?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [link, setLink] = useState(`/c/${slug}`);

  useEffect(() => {
    setLink(`${window.location.origin}/c/${slug}`);
  }, [slug]);

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`);
    setNote("Link copied.");
  }

  function whatsapp() {
    const text = encodeURIComponent(`I made you a Christmas card: ${window.location.origin}/c/${slug}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  async function emailCard() {
    setPending(true);
    setNote(null);
    const result = await sendCardEmail({ slug, to: email });
    setPending(false);
    setNote(result.error ?? "Sent. They should see it in their inbox.");
  }

  async function remove() {
    if (!cardId || !confirm("Delete this card?")) return;
    const result = await deleteCard(cardId);
    if (result.error) {
      setNote(result.error);
      return;
    }
    router.push("/cards");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-[28px] border border-ink/10 bg-cream/90 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-pine/60">Share</p>
      {canManage ? (
        <>
      <p className="break-all text-sm text-ink/70">{link}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          Copy link
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={whatsapp}>
          WhatsApp
        </Button>
        <a href={`mailto:?subject=A Christmas card for you&body=${encodeURIComponent(link)}`}>
          <Button type="button" variant="outline" size="sm">
            Email app
          </Button>
        </a>
      </div>
      <div>
        <Label htmlFor="to">Send with Resend</Label>
        <div className="flex gap-2">
          <Input id="to" type="email" value={email} placeholder="their@email.com" onChange={(event) => setEmail(event.target.value)} />
          <Button type="button" variant="berry" onClick={emailCard} disabled={pending || !email}>
            Send
          </Button>
        </div>
      </div>
      {note && <p className="text-sm text-pine">{note}</p>}
      {cardId && (
        <Button type="button" variant="ghost" onClick={remove}>
          Delete this card
        </Button>
      )}
        </>
      ) : (
        <p className="text-sm text-ink/70">
          This card is ready to read.{" "}
          <Link href={`/login?next=/c/${slug}`} className="underline">
            Sign in
          </Link>{" "}
          to send one of your own.
        </p>
      )}
    </div>
  );
}

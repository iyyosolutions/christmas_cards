"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCard, updateCard } from "@/app/actions/cards";
import { GreetingCard } from "@/components/cards/greeting-card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { MESSAGE_LIMIT } from "@/lib/wishes";

type Wish = { message: string; senderName: string };

export function CardComposer({
  templateId,
  designId,
  mode,
  cardId,
  initialRecipient = "",
  initialMessage = "",
  initialSender = "",
  initialWishes,
  initialPhoto = "",
}: {
  templateId: string;
  designId: string;
  mode: "general" | "personal";
  cardId?: string;
  initialRecipient?: string;
  initialMessage?: string;
  initialSender?: string;
  initialWishes?: Wish[];
  initialPhoto?: string;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [recipientName, setRecipientName] = useState(initialRecipient);
  const [message, setMessage] = useState(initialMessage);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes?.length ? initialWishes : [{ message: "", senderName: initialSender }]);
  const [photo, setPhoto] = useState(initialPhoto);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const personalWishes = wishes
    .map((wish) => ({ message: wish.message.trim(), senderName: wish.senderName.trim() }))
    .filter((wish) => wish.message);

  async function onCreate() {
    if (mode === "general" && message.trim().length < 1) {
      setError("Write the wish.");
      return;
    }
    if (mode === "personal" && recipientName.trim().length < 1) {
      setError("Add the person's name.");
      return;
    }
    if (mode === "personal" && personalWishes.length < 1) {
      setError("Add at least one wish.");
      return;
    }
    setPending(true);
    setError(null);
    let imageDataUrl: string | undefined;
    if (cardRef.current) {
      const { toPng } = await import("html-to-image");
      await document.fonts.ready;
      imageDataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
    }
    if (!imageDataUrl) {
      setPending(false);
      setError("The card image could not be created.");
      return;
    }
    const payload = {
      templateId,
      wishMode: mode,
      recipientName: mode === "personal" ? recipientName : "",
      message: mode === "personal" ? personalWishes.map((wish) => wish.message).join("\n\n") : message,
      senderName: mode === "personal" ? personalWishes[0]?.senderName || "" : "",
      wishes: mode === "personal" ? personalWishes : undefined,
      photoDataUrl: photo || undefined,
      imageDataUrl,
    };
    const result = cardId ? await updateCard(cardId, payload) : await saveCard(payload);
    setPending(false);
    if (result.error || !result.slug) {
      setError(result.error ?? "The card could not be saved.");
      return;
    }
    router.push(`/share/${result.slug}`);
  }

  return (
    <div className="space-y-4">
      {mode === "personal" ? (
        <>
          <div>
            <Label htmlFor="recipient">Their name</Label>
            <Input id="recipient" value={recipientName} maxLength={40} onChange={(event) => setRecipientName(event.target.value)} />
          </div>
          {wishes.map((wish, index) => (
            <div key={index} className="space-y-2 rounded-2xl border border-ink/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-pine/70">Wish {index + 1}</p>
                {wishes.length > 1 && (
                  <button type="button" className="text-xs text-berry" onClick={() => setWishes((current) => current.filter((_, item) => item !== index))}>
                    Remove
                  </button>
                )}
              </div>
              <Input
                aria-label="From"
                placeholder="From"
                value={wish.senderName}
                maxLength={40}
                onChange={(event) => setWishes((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, senderName: event.target.value } : item))}
              />
              <Textarea
                aria-label="Wish"
                placeholder="Their wish"
                value={wish.message}
                maxLength={MESSAGE_LIMIT}
                onChange={(event) => setWishes((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, message: event.target.value } : item))}
              />
            </div>
          ))}
          {wishes.length < 8 && (
            <Button type="button" variant="outline" onClick={() => setWishes((current) => [...current, { message: "", senderName: "" }])}>
              Add another person&apos;s wish
            </Button>
          )}
        </>
      ) : (
        <div>
          <Label htmlFor="message">The wish</Label>
          <Textarea id="message" value={message} maxLength={MESSAGE_LIMIT} placeholder="Write anything you like." onChange={(event) => setMessage(event.target.value)} />
        </div>
      )}
      <div>
        <Label htmlFor="photo">Attach an image</Label>
        <Input
          id="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (file.size > 2_000_000) {
              setError("The attached image must be under 2 MB.");
              return;
            }
            const reader = new FileReader();
            reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : "");
            reader.readAsDataURL(file);
          }}
        />
        {photo && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="h-24 rounded-xl object-cover" />
            <button type="button" className="mt-1 text-xs text-berry" onClick={() => setPhoto("")}>Remove image</button>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-berry">{error}</p>}
      <Button type="button" onClick={onCreate} disabled={pending}>
        {pending ? "Saving…" : cardId ? "Save changes" : "Create card"}
      </Button>
      <div ref={cardRef} className="pointer-events-none fixed top-0 left-[-2400px] w-[480px]" aria-hidden>
        <GreetingCard draft={{ templateId: designId, recipientName: "", message: "", senderName: "" }} />
      </div>
    </div>
  );
}

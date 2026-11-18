"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCard } from "@/app/actions/cards";
import { GreetingCard } from "@/components/cards/greeting-card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import type { CardStyle } from "@/lib/types";
import type { Template } from "@/lib/templates";
import { coloursFor, MESSAGE_LIMIT, wishes, wishCategories, type WishCategory } from "@/lib/wishes";
import { cn } from "@/lib/utils";

type PreviewMode = "desktop" | "mobile" | "front";

export function CardStudio({
  template,
  designId,
  senderName,
}: {
  template: Template;
  designId: string;
  senderName: string;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"general" | "personal">("general");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(senderName);
  const [category, setCategory] = useState<WishCategory>("Heartfelt");
  const [style, setStyle] = useState<CardStyle>({
    textColor: coloursFor(designId)[0].value,
    fontStyle: "serif",
    textAlign: "left",
  });
  const [preview, setPreview] = useState<PreviewMode>("front");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const colours = coloursFor(designId);
  const draft = {
    templateId: designId,
    recipientName: mode === "personal" ? recipientName : "",
    message,
    senderName: sender,
    style,
  };

  function updateStyle(patch: Partial<CardStyle>) {
    setStyle((current) => ({ ...current, ...patch }));
  }

  async function onGenerate() {
    if (message.trim().length < 8) {
      setError("Write a slightly longer wish.");
      return;
    }
    if (mode === "personal" && recipientName.trim().length < 1) {
      setError("Add the recipient's name, or switch to a general wish.");
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
    const result = await saveCard({
      ...draft,
      wishMode: mode,
      imageDataUrl,
    });
    setPending(false);
    if (result.error || !result.slug) {
      setError(result.error ?? "The card could not be saved.");
      return;
    }
    router.push(`/share/${result.slug}`);
  }

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_440px]">
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-5xl text-pine-deep">{template.name}</h1>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-xs uppercase tracking-[0.16em] text-pine/70">Recipient</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setMode("general")} className={choiceClass(mode === "general")}>
              <span className="block font-medium">General Christmas wish</span>
            </button>
            <button type="button" onClick={() => setMode("personal")} className={choiceClass(mode === "personal")}>
              <span className="block font-medium">Personalised Christmas wish</span>
            </button>
          </div>
          {mode === "personal" && (
            <div className="space-y-3 pt-2">
              <div>
                <Label htmlFor="recipient">Recipient&apos;s name</Label>
                <Input id="recipient" value={recipientName} maxLength={40} onChange={(event) => setRecipientName(event.target.value)} />
              </div>
              <div>
                <Label htmlFor="sender">Sender&apos;s name, if you want one</Label>
                <Input id="sender" value={sender} maxLength={40} onChange={(event) => setSender(event.target.value)} />
              </div>
            </div>
          )}
        </fieldset>

        <div>
          <Label htmlFor="message">Your Christmas wish</Label>
          <Textarea id="message" value={message} maxLength={MESSAGE_LIMIT} onChange={(event) => setMessage(event.target.value)} placeholder="Write your own, or choose a suggestion below." />
          <p className="mt-1 text-right text-xs text-ink/50">{message.length}/{MESSAGE_LIMIT}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {wishCategories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={cn("rounded-full border px-3 py-1 text-xs", category === item ? "border-pine bg-pine text-cream" : "border-ink/10 bg-cream")}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {wishes.filter((wish) => wish.category === category).map((wish) => (
              <button key={wish.text} type="button" onClick={() => setMessage(wish.text.slice(0, MESSAGE_LIMIT))} className="block w-full rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-left text-sm text-ink/80 hover:border-gold">
                {wish.text}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-xs uppercase tracking-[0.16em] text-pine/70">Text</legend>
          <div className="flex flex-wrap gap-2">
            {colours.map((colour) => (
              <button key={colour.value} type="button" aria-label={colour.label} onClick={() => updateStyle({ textColor: colour.value })} className={cn("size-8 rounded-full border-2", style.textColor === colour.value ? "border-pine" : "border-transparent")} style={{ background: colour.value }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["serif", "sans", "script"] as const).map((font) => (
              <button key={font} type="button" onClick={() => updateStyle({ fontStyle: font })} className={cn("rounded-full border px-3 py-1 text-xs capitalize", style.fontStyle === font ? "border-pine bg-pine text-cream" : "border-ink/10 bg-cream")}>
                {font}
              </button>
            ))}
            {(["left", "center"] as const).map((align) => (
              <button key={align} type="button" onClick={() => updateStyle({ textAlign: align })} className={cn("rounded-full border px-3 py-1 text-xs capitalize", style.textAlign === align ? "border-pine bg-pine text-cream" : "border-ink/10 bg-cream")}>
                {align}
              </button>
            ))}
          </div>
        </fieldset>

        {error && <p className="text-sm text-berry">{error}</p>}
        <Button onClick={onGenerate} disabled={pending}>
          {pending ? "Generating…" : "Generate Christmas Card"}
        </Button>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="mb-3 flex gap-2">
          {(["desktop", "mobile", "front"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setPreview(item)} className={cn("rounded-full px-3 py-1 text-xs capitalize", preview === item ? "bg-pine text-cream" : "bg-cream text-ink/70")}>
              {item}
            </button>
          ))}
        </div>
        <div className={cn("mx-auto flex justify-center", preview === "mobile" && "w-[280px] rounded-[36px] border-8 border-pine-deep bg-pine-deep p-2")}>
          <div className={cn("w-full", preview === "mobile" ? "max-w-[250px]" : preview === "desktop" ? "max-w-[360px]" : "max-w-[420px]")}>
            <GreetingCard draft={draft} />
          </div>
        </div>
        <div ref={cardRef} className="pointer-events-none fixed top-0 left-[-2000px] w-[480px]" aria-hidden>
          <GreetingCard draft={draft} />
        </div>
        <p className="mt-3 text-center text-xs text-ink/50">Front of the card. The illustration does not move.</p>
      </div>
    </div>
  );
}

function choiceClass(active: boolean) {
  return cn("rounded-2xl border px-4 py-3 text-left", active ? "border-pine bg-cream" : "border-ink/10 bg-cream/50");
}

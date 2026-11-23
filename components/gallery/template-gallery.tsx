"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CardComposer } from "@/components/cards/card-composer";
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
import { handFont } from "@/lib/fonts";
import { GreetingCard } from "@/components/cards/greeting-card";
import { Button } from "@/components/ui/button";
import { classicOpenIds, type Template } from "@/lib/templates";
import type { CardDraft } from "@/lib/types";

export type GalleryTemplate = Template & { design: string };

export function TemplateGallery({ templates, signedIn }: { templates: GalleryTemplate[]; signedIn: boolean }) {
  const router = useRouter();
  const [chosen, setChosen] = useState<GalleryTemplate | null>(null);
  const [preview, setPreview] = useState<GalleryTemplate | null>(null);
  const [mode, setMode] = useState<"general" | "personal" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function open(template: GalleryTemplate) {
    if (!signedIn) {
      router.push("/login?next=/templates");
      return;
    }
    setChosen(template);
    setMode(null);
  }

  return (
    <div>
      <p className="tape inline-block px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#1f3d3a]">Designs</p>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
            <article key={template.id}>
              <button type="button" className="paper-sheet block w-full p-3 text-left" onClick={() => open(template)}>
                <GreetingCard draft={{ templateId: template.design, recipientName: "", message: "", senderName: "" }} />
                <h2 className="mt-3 text-center text-[11px] uppercase tracking-[0.22em] text-ink/60">{template.name}</h2>
              </button>
              <button
                type="button"
                onClick={() => setPreview(template)}
                className={`${handFont.className} mx-auto mt-3 mb-2 block bg-white px-4 py-1 text-2xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:rotate-1`}
              >
                Preview
              </button>
            </article>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-[#2c313b]/75 p-3 pb-16 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={`Preview ${preview.name}`} onClick={() => setPreview(null)}>
          <div className="notebook w-full max-w-lg rounded-2xl p-4 text-ink sm:p-6" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <p className="display min-w-0 text-3xl text-[#7eb8b2] sm:text-4xl">{preview.name}</p>
              <Button type="button" variant="ghost" className="relative z-10 shrink-0" onClick={() => setPreview(null)}>Close</Button>
            </div>
            <SentPreview key={preview.design} design={preview.design} />
            <button
              type="button"
              onClick={() => {
                const template = preview;
                setPreview(null);
                open(template);
              }}
              className={`${handFont.className} mx-auto mt-4 mb-2 block bg-white px-5 py-2 text-3xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:-rotate-1`}
            >
              Use this
            </button>
          </div>
        </div>
      )}

      {chosen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2c313b]/75 p-3 pb-16 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={chosen.name} onClick={() => setChosen(null)}>
          <div className="notebook max-h-[calc(100dvh-5.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl p-4 pb-6 text-ink sm:max-h-[88vh] sm:p-6" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-20 mb-4 flex items-start justify-between gap-3 bg-[#efe6d6]">
              <p className="display min-w-0 text-3xl text-[#7eb8b2] sm:text-4xl">{chosen.name}</p>
              <Button type="button" variant="ghost" className="relative z-10 shrink-0" onClick={() => setChosen(null)}>Close</Button>
            </div>
            {mode === null ? (
              <div>
                <p className="text-sm text-ink/70">Who is this card for?</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-6">
                  <button type="button" onClick={() => setMode("personal")} className={`${handFont.className} min-h-28 bg-white px-2 py-4 text-center text-xl leading-snug text-[#2c2824] shadow-[4px_6px_0_rgba(60,50,40,0.12)] sm:-rotate-2 sm:px-4 sm:text-3xl sm:leading-none`}>
                    Personalised for one person
                  </button>
                  <button type="button" onClick={() => setMode("general")} className={`${handFont.className} min-h-28 bg-white px-2 py-4 text-center text-xl leading-snug text-[#2c2824] shadow-[4px_6px_0_rgba(60,50,40,0.12)] sm:rotate-2 sm:px-4 sm:text-3xl sm:leading-none`}>
                    A general wish
                  </button>
                </div>
              </div>
            ) : (
              <CardComposer templateId={chosen.id} designId={chosen.design} mode={mode} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SentPreview({ design }: { design: string }) {
  const draft: CardDraft = {
    templateId: design,
    recipientName: "you",
    message: "Wishing you a warm and happy Christmas.",
    senderName: "A friend",
  };
  if (design === "cozy-bear") return <CozyDrop draft={draft} />;
  if (design === "flake-grid") return <FlakeTiles draft={draft} />;
  if (design === "nutcracker") return <NutcrackerFold draft={draft} />;
  if (design === "reindeer-pair") return <ReindeerIris draft={draft} />;
  if (design === "night-street") return <NightLift draft={draft} />;
  if (design === "snow-village") return <VillageSplit draft={draft} />;
  if (design === "gold-snow") return <SnowSpin draft={draft} />;
  if (design === "watercolor-santa") return <SantaLift draft={draft} />;
  if (design === "pine-gnome") return <GnomeReveal draft={draft} />;
  if (design === "gift-box") return <GiftTurn draft={draft} />;
  if (design === "ribbon-wreath") return <WreathFlip draft={draft} />;
  if (classicOpenIds.includes(design)) return <OpeningCard draft={draft} auto />;
  return <EnvelopeReveal draft={draft} />;
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { GreetingCard } from "@/components/cards/greeting-card";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Template } from "@/lib/templates";

export type GalleryTemplate = Template & { design: string };

export function TemplateGallery({ templates }: { templates: GalleryTemplate[] }) {
  const [preview, setPreview] = useState<GalleryTemplate | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-serif text-5xl text-pine-deep">Choose a card.</h1>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
            <article key={template.id} className="flex flex-col">
              <GreetingCard
                draft={{
                  templateId: template.design,
                  recipientName: "you",
                  message: template.tagline,
                  senderName: template.mood,
                }}
              />
              <h2 className="mt-4 font-serif text-3xl text-pine">{template.name}</h2>
              <div className="mt-4 flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPreview(template)}>
                  Preview
                </Button>
                <Link href={`/create/${template.id}`} className={buttonVariants({ size: "sm" })}>
                  Use This Template
                </Link>
              </div>
            </article>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-deep/70 p-4" role="dialog" aria-modal="true" aria-label={preview.name}>
          <div className="w-full max-w-md">
            <GreetingCard
              draft={{
                templateId: preview.design,
                recipientName: "you",
                message: preview.tagline,
                senderName: "With love",
              }}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-cream">
              <div>
                <p className="font-serif text-2xl">{preview.name}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setPreview(null)}>
                  Close
                </Button>
                <Link href={`/create/${preview.id}`} className={buttonVariants({ variant: "gold" })}>
                  Use This Template
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

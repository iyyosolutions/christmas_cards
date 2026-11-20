import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicCardView } from "@/components/cards/public-card-view";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { cardUrl } from "@/lib/utils";

type CardRow = {
  recipient_name: string | null;
  message: string;
  sender_name: string;
  card_image_url: string | null;
  design_options: { design?: string; textColor?: string; fontStyle?: string; textAlign?: string; wishes?: { message: string; senderName: string }[]; attachment?: string | null } | null;
  is_public: boolean;
};

async function loadCard(token: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cards")
    .select("recipient_name, message, sender_name, card_image_url, design_options, is_public")
    .eq("share_token", token)
    .eq("is_public", true)
    .maybeSingle();
  return data as CardRow | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: "Christmas card" };
  const card = await loadCard(slug);
  if (!card) return { title: "Christmas card" };
  const title = card.recipient_name ? `A Christmas card for ${card.recipient_name}` : "A Christmas card for you";
  const description = `${card.sender_name} sent you a Christmas wish.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: cardUrl(slug),
      images: card.card_image_url ? [{ url: card.card_image_url }] : undefined,
    },
  };
}

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) notFound();
  const card = await loadCard(slug);
  if (!card) notFound();
  const options = card.design_options ?? {};

  return (
    <PublicCardView
      imageUrl={card.card_image_url}
      senderName={card.sender_name}
      recipientName={card.recipient_name}
      draft={{
        templateId: options.design ?? "warm-bench",
        recipientName: card.recipient_name ?? "",
        message: card.message,
        senderName: card.sender_name,
        wishes: Array.isArray(options.wishes) ? options.wishes : undefined,
        photoUrl: typeof options.attachment === "string" ? options.attachment : undefined,
        style: {
          textColor: options.textColor,
          fontStyle: options.fontStyle === "sans" || options.fontStyle === "script" ? options.fontStyle : "serif",
          textAlign: options.textAlign === "center" ? "center" : "left",
        },
      }}
    />
  );
}

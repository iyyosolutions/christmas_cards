import { notFound } from "next/navigation";
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
import { ShareDesk } from "@/components/cards/share-desk";
import { classicOpenIds } from "@/lib/templates";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: card } = await supabase
    .from("cards")
    .select("user_id, sender_name, recipient_name, message, share_token, card_image_url, design_options")
    .eq("share_token", slug)
    .maybeSingle();

  if (!card || card.user_id !== user?.id) notFound();

  const design = typeof card.design_options?.design === "string" ? card.design_options.design : "warm-bench";

  return (
    <div className="mx-auto grid max-w-lg gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-berry">Your card is ready</p>
        <h1 className="display mt-2 text-4xl leading-none text-[#7eb8b2] sm:text-5xl">Send it</h1>
        <p className="mt-3 text-ink/70">
          {card.recipient_name ? `Written for ${card.recipient_name}. ` : "A general Christmas wish. "}
          Anyone with the link can open it. They do not need an account.
        </p>
      </div>
      {design === "cozy-bear" ? (
        <CozyDrop
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "flake-grid" ? (
        <FlakeTiles
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "nutcracker" ? (
        <NutcrackerFold
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "reindeer-pair" ? (
        <ReindeerIris
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "night-street" ? (
        <NightLift
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "snow-village" ? (
        <VillageSplit
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "gold-snow" ? (
        <SnowSpin
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "watercolor-santa" ? (
        <SantaLift
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "pine-gnome" ? (
        <GnomeReveal
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "gift-box" ? (
        <GiftTurn
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : design === "ribbon-wreath" ? (
        <WreathFlip
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : classicOpenIds.includes(design) ? (
        <OpeningCard
          auto
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      ) : (
        <EnvelopeReveal
          draft={{
            templateId: design,
            recipientName: card.recipient_name ?? "",
            message: card.message,
            senderName: card.sender_name,
            wishes: Array.isArray(card.design_options?.wishes) ? card.design_options.wishes : undefined,
            photoUrl: typeof card.design_options?.attachment === "string" ? card.design_options.attachment : undefined,
          }}
        />
      )}
      <ShareDesk slug={card.share_token} senderName={card.sender_name} recipientName={card.recipient_name} imageUrl={card.card_image_url} />
    </div>
  );
}

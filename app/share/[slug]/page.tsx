import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareDesk } from "@/components/cards/share-desk";
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
    .select("user_id, sender_name, recipient_name, share_token, card_image_url")
    .eq("share_token", slug)
    .maybeSingle();

  if (!card || card.user_id !== user?.id) notFound();

  const imageUrl = card.card_image_url;

  return (
    <div className="mx-auto grid max-w-3xl gap-8 px-5 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-berry">Your card is ready</p>
        <h1 className="mt-3 font-serif text-5xl text-pine-deep">Send it while the evening is still warm.</h1>
        <p className="mt-3 text-ink/70">
          {card.recipient_name ? `Written for ${card.recipient_name}. ` : "A general Christmas wish. "}
          Anyone with the link can open it. They do not need an account.
        </p>
      </div>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Your Christmas card" className="mx-auto w-full max-w-sm rounded-[28px]" />
      )}
      <ShareDesk slug={card.share_token} senderName={card.sender_name} recipientName={card.recipient_name} imageUrl={imageUrl} />
      <Link href={`/card/${card.share_token}`} className="text-sm text-pine underline">
        Open the public card
      </Link>
    </div>
  );
}

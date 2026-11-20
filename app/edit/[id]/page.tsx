import { notFound } from "next/navigation";
import { CardComposer } from "@/components/cards/card-composer";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured()) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: card } = await supabase
    .from("cards")
    .select("id, user_id, template_id, recipient_name, message, sender_name, design_options")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!card) notFound();
  const options = card.design_options ?? {};
  const mode = options.wishMode === "personal" || card.recipient_name ? "personal" : "general";
  const design = typeof options.design === "string" ? options.design : card.template_id;

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="mb-6 font-serif text-4xl text-pine-deep">Edit this card</h1>
      <CardComposer
        cardId={card.id}
        templateId={design}
        designId={design}
        mode={mode}
        initialRecipient={card.recipient_name ?? ""}
        initialMessage={card.message}
        initialSender={card.sender_name}
        initialWishes={Array.isArray(options.wishes) ? options.wishes : undefined}
        initialPhoto={typeof options.attachment === "string" ? options.attachment : ""}
      />
    </div>
  );
}

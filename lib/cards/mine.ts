import { createClient } from "@/lib/supabase/server";
import type { DashboardCard } from "@/components/dashboard/card-grid";

export async function loadMyCards() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, name: "there", cards: [] as DashboardCard[] };

  const { data } = await supabase
    .from("cards")
    .select("id, user_id, template_id, recipient_name, message, sender_name, share_token, card_image_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const cards: DashboardCard[] = (data ?? []).map((card) => ({
    ...card,
    imageUrl: card.card_image_url,
  }));

  const name =
    typeof user.user_metadata?.display_name === "string" && user.user_metadata.display_name
      ? user.user_metadata.display_name
      : user.email?.split("@")[0] || "there";

  return { user, name, cards };
}

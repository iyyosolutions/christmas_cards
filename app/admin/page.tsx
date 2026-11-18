import { notFound } from "next/navigation";
import { AdminTemplates, type AdminTemplate } from "@/components/admin/admin-templates";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) notFound();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user?.id ?? "").maybeSingle();
  if (!profile?.is_admin) notFound();

  const { data } = await supabase.from("templates").select("id, name, category, description, preview_image, template_config, is_active").order("created_at", { ascending: false });
  const templates: AdminTemplate[] = (data ?? []).map((template) => ({
    id: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    preview_image: template.preview_image,
    design: typeof template.template_config?.design === "string" ? template.template_config.design : "holly-ribbon",
    is_active: template.is_active,
  }));

  const { data: people } = await supabase.from("profiles").select("id, full_name, email, created_at, is_admin").order("created_at", { ascending: false });
  const { data: cards } = await supabase.from("cards").select("id, user_id, is_public, created_at");
  const { count: shareCount } = await supabase.from("card_shares").select("id", { count: "exact", head: true });

  const cardCounts = new Map<string, number>();
  for (const card of cards ?? []) {
    cardCounts.set(card.user_id, (cardCounts.get(card.user_id) ?? 0) + 1);
  }
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const cardsThisWeek = (cards ?? []).filter((card) => new Date(card.created_at).getTime() >= weekAgo).length;
  const stats = [
    ["People", String(people?.length ?? 0)],
    ["Admins", String((people ?? []).filter((person) => person.is_admin).length)],
    ["Cards", String(cards?.length ?? 0)],
    ["Cards this week", String(cardsThisWeek)],
    ["Shares sent", String(shareCount ?? 0)],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.24em] text-berry">Admin</p>
      <h1 className="mt-2 font-serif text-5xl text-pine-deep">Everyone on Hearth & Holly</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-ink/10 bg-cream px-5 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/50">{label}</p>
            <p className="mt-2 font-serif text-4xl text-pine">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 overflow-x-auto rounded-[28px] border border-ink/10 bg-cream">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-ink/50">
            <tr>
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Joined</th>
              <th className="px-5 py-4 font-medium">Cards</th>
              <th className="px-5 py-4 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {(people ?? []).map((person) => (
              <tr key={person.id} className="border-t border-ink/10">
                <td className="px-5 py-4 font-serif text-xl text-pine">{person.full_name || "—"}</td>
                <td className="px-5 py-4">{person.email}</td>
                <td className="px-5 py-4">{new Date(person.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-4">{cardCounts.get(person.id) ?? 0}</td>
                <td className="px-5 py-4">{person.is_admin ? "Admin" : "Member"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-16 font-serif text-4xl text-pine-deep">Template library</h2>
      <p className="mt-3 max-w-xl text-ink/70">Add, edit, categorise, activate, or remove designs. Hidden templates stay out of the gallery.</p>
      <div className="mt-8">
        <AdminTemplates templates={templates} />
      </div>
    </div>
  );
}

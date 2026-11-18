import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-5xl text-pine-deep">Your profile</h1>
        <p className="mt-4 text-ink/70">Add Supabase keys to .env.local to load your account.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const fullName =
    typeof user?.user_metadata?.display_name === "string" ? user.user_metadata.display_name : "—";
  const { count } = await supabase
    .from("cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id ?? "");

  const rows = [
    ["Full name", fullName],
    ["Email address", user?.email ?? "—"],
    ["Account created", user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"],
    ["Cards created", String(count ?? 0)],
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.24em] text-berry">Account</p>
      <h1 className="mt-3 font-serif text-5xl text-pine-deep">Your profile</h1>
      <dl className="mt-8 divide-y divide-ink/10 rounded-[28px] border border-ink/10 bg-cream/90">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-6 py-5 sm:grid-cols-[180px_1fr] sm:items-baseline">
            <dt className="text-xs uppercase tracking-[0.16em] text-pine/60">{label}</dt>
            <dd className="font-serif text-2xl text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

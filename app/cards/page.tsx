import Link from "next/link";
import { CardGrid } from "@/components/dashboard/card-grid";
import { buttonVariants } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { loadMyCards } from "@/lib/cards/mine";
import { cn } from "@/lib/utils";

export default async function CardsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-5xl text-pine-deep">My cards</h1>
        <p className="mt-4 text-ink/70">Add Supabase keys to .env.local, then run the SQL in supabase/schema.sql.</p>
      </div>
    );
  }

  const { name, cards } = await loadMyCards();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-4xl leading-none text-[#7eb8b2] sm:text-5xl">{name}</h1>
        <Link href="/templates" className={cn(buttonVariants({ size: "sm" }), "sm:h-12 sm:px-6 sm:text-sm")}>
          Quick Create Card
        </Link>
      </div>
      {cards.length === 0 ? (
        <p className="mt-10 text-ink/70">Nothing here yet. Create a card and it will appear in this grid.</p>
      ) : (
        <div className="mt-10">
          <CardGrid cards={cards} />
        </div>
      )}
    </div>
  );
}

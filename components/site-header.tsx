"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [admin, setAdmin] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email ?? null);
      if (!data.user) return;
      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", data.user.id).maybeSingle();
      setAdmin(Boolean(profile?.is_admin));
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      if (!session?.user) setAdmin(false);
    });
    return () => subscription.subscription.unsubscribe();
  }, [configured, pathname]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-pine-deep/95 text-cream backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          Hearth & Holly
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/templates" className="rounded-full px-3 py-2 text-cream/80 hover:text-cream">
            Templates
          </Link>
          {email ? (
            <>
              <Link href="/cards" className="rounded-full px-3 py-2 text-cream/80 hover:text-cream">
                My cards
              </Link>
              {admin && (
                <Link href="/admin" className="rounded-full px-3 py-2 text-gold hover:text-cream">
                  Admin
                </Link>
              )}
              <Button variant="gold" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-3 py-2 text-cream/80 hover:text-cream">
                Sign in
              </Link>
              <Link href="/signup">
                <Button variant="gold" size="sm">
                  Create account
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

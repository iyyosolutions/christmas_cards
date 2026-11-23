"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { handFont } from "@/lib/fonts";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

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
    router.push("/templates");
    router.refresh();
  }

  return (
    <header className="relative z-20 px-3 pb-1 pt-8 text-ink sm:px-10 sm:pt-12">
      <nav className="mb-4 flex flex-wrap items-center gap-2 sm:absolute sm:right-8 sm:top-8 sm:mb-0 sm:gap-3">
        <Link href="/templates" className={`${handFont.className} bg-white px-3 py-1 text-xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:-rotate-2 sm:text-2xl`}>Designs</Link>
        {email ? (
          <>
            <Link href="/cards" className={`${handFont.className} bg-white px-3 py-1 text-xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:rotate-1 sm:text-2xl`}>Cards</Link>
            {admin && <Link href="/admin" className={`${handFont.className} bg-white px-3 py-1 text-xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:-rotate-1 sm:text-2xl`}>Admin</Link>}
            <button type="button" className={`${handFont.className} bg-white px-3 py-1 text-xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:rotate-2 sm:text-2xl`} onClick={signOut}>Out</button>
          </>
        ) : (
          <>
            <Link href="/login" className={`${handFont.className} bg-white px-3 py-1 text-xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:rotate-1 sm:text-2xl`}>Sign in</Link>
            <Link href="/signup" className={`${handFont.className} bg-white px-3 py-1 text-xl leading-none text-[#2c2824] shadow-[3px_4px_0_rgba(60,50,40,0.12)] sm:rotate-2 sm:text-2xl`}>Join</Link>
          </>
        )}
      </nav>
      <Link href="/templates" className="display block max-w-full text-[2.75rem] leading-[0.85] text-[#7eb8b2] sm:text-7xl">
        Send
        <br />
        a wish
      </Link>
      <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-ink/45">Christmas cards</p>
    </header>
  );
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { REMEMBER_COOKIE, withRemember } from "@/lib/auth/session";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            const remember = cookieStore.get(REMEMBER_COOKIE)?.value !== "0";
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, withRemember(options, remember));
            });
          } catch {
            // Server Components cannot always write cookies. Proxy refreshes the session.
          }
        },
      },
    },
  );
}

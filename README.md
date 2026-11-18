# Hearth & Holly

A Christmas card studio. People create an account, pick a design, write a wish, and share it by link, WhatsApp, or email.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Supabase Auth and Postgres, Supabase Storage, html-to-image, and Resend.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the keys.
2. In Supabase, enable email and password auth, and turn on email confirmation.
3. Add `http://localhost:3000/auth/callback` (and your Vercel URL) to the Auth redirect allow list. The same callback handles email verification and password resets.
4. Run `supabase/schema.sql` in the SQL editor. It creates `profiles`, `templates`, `cards`, and `card_shares`, with foreign keys, indexes, row level security, a signup trigger, and the storage buckets. It also seeds the twelve card designs.
5. Promote your account after you register: `update public.profiles set is_admin = true where email = 'you@example.com';` Only that account can open `/admin`.
6. In Resend, verify a sending domain and set `RESEND_FROM_EMAIL`.
7. `npm run dev`

The app uses the Supabase anon key. Do not add the service-role key. Card creation is limited to 8 an hour per account, and email sending to 10 an hour. Card images must be PNG files under 4 MB. Template previews must be PNG, JPG, or WebP under 2 MB.

The home page works before the keys are added. The gallery, saving a card, sign-in, and email need Supabase. Email also needs Resend.

## Deploy

Connect the repository to Vercel and set the same environment variables. Point `NEXT_PUBLIC_SITE_URL` at the production domain, and add that domain’s `/auth/callback` URL in Supabase.

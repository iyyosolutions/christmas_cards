import Link from "next/link";
import { GreetingCard } from "@/components/cards/greeting-card";
import { buttonVariants } from "@/components/ui/button";
import { templates } from "@/lib/templates";

const previewIds = ["holly-ribbon", "midnight-gold", "cocoa-mug"];

export default function HomePage() {
  const previews = templates.filter((template) => previewIds.includes(template.id));

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-berry">Christmas, written by hand</p>
          <h1 className="mt-4 font-serif text-6xl leading-[0.95] text-pine-deep md:text-7xl">
            Share the Magic of Christmas
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink/75">
            Create beautiful personalised Christmas cards and send a little happiness to the people who matter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Create Your Christmas Card
            </Link>
            <Link href="/templates" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Explore Designs
            </Link>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-berry">A first look</p>
            <h2 className="mt-2 font-serif text-4xl text-pine-deep">Cards waiting for your words</h2>
          </div>
          <Link href="/templates" className="text-sm text-pine underline">
            See the whole collection
          </Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {previews.map((template) => (
            <Link key={template.id} href={`/create/${template.id}`} className="block">
              <GreetingCard
                draft={{
                  templateId: template.id,
                  recipientName: "you",
                  message: template.tagline,
                  senderName: "With love",
                }}
              />
              <p className="mt-4 font-serif text-2xl text-pine">{template.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-pine-deep text-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          {[
            ["01", "Choose Your Design.", "Pick a card that feels like the person you are writing to."],
            ["02", "Write Your Christmas Wish.", "Add their name, a few honest lines, and your own."],
            ["03", "Share the Happiness.", "Send it by WhatsApp, email, or a link they can open tonight."],
          ].map(([step, title, copy]) => (
            <article key={step}>
              <p className="text-xs tracking-[0.2em] text-gold">{step}</p>
              <h2 className="mt-3 font-serif text-3xl">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-cream/75">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-berry">The platform</p>
          <h2 className="mt-3 font-serif text-5xl text-pine-deep">A small studio for a personal greeting.</h2>
        </div>
        <div className="space-y-4 text-ink/75 leading-7">
          <p>
            Hearth & Holly is a place to make a Christmas card that sounds like you. Create an account, choose a design, and keep every card you have sent.
          </p>
          <p>
            Each card gets its own link. You can pass it along on WhatsApp, send it by email, or keep it for the people who like to open something slowly.
          </p>
          <Link href="/signup" className="inline-block text-pine underline">
            Register and write your first card
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-pine-deep text-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-3xl">Hearth & Holly</p>
            <p className="mt-2 max-w-xs text-sm text-cream/70">Personal Christmas cards, sent while the evening is still warm.</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-cream/80">
            <Link href="/templates" className="hover:text-cream">Designs</Link>
            <Link href="/signup" className="hover:text-cream">Create an account</Link>
            <Link href="/login" className="hover:text-cream">Sign in</Link>
            <Link href="/cards" className="hover:text-cream">Your cards</Link>
          </nav>
        </div>
        <p className="border-t border-white/10 px-5 py-4 text-center text-xs tracking-wide text-cream/50">
          © {new Date().getFullYear()} Hearth & Holly. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-md" aria-hidden>
      <div className="absolute inset-x-8 bottom-6 top-16 rounded-[40px] bg-[#143028] shadow-[0_30px_70px_rgba(20,48,40,0.25)]" />
      <svg viewBox="0 0 360 420" className="relative h-full w-full">
        <circle cx="70" cy="70" r="6" fill="#c6a15b" />
        <circle cx="300" cy="48" r="4" fill="#f7f1e5" />
        <circle cx="320" cy="110" r="3" fill="#c6a15b" />
        <polygon points="180,70 230,210 130,210" fill="#1f6b4a" />
        <polygon points="180,120 245,250 115,250" fill="#174f38" />
        <polygon points="180,170 260,300 100,300" fill="#123f2d" />
        <rect x="168" y="300" width="24" height="36" fill="#6b3a24" />
        <circle cx="180" cy="150" r="8" fill="#8d2c3b" />
        <circle cx="150" cy="210" r="7" fill="#c6a15b" />
        <circle cx="214" cy="230" r="7" fill="#f4efe4" />
        <path d="M250 78 l8 16 18 2-14 12 4 18-16-10-16 10 4-18-14-12 18-2z" fill="#e8d7a8" />
        <rect x="78" y="330" width="204" height="46" rx="23" fill="#fbf7ef" />
        <text x="180" y="358" textAnchor="middle" fill="#143028" fontSize="16" fontFamily="Georgia, serif">
          Merry Christmas
        </text>
      </svg>
    </div>
  );
}

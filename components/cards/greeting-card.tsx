import type { CardDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

const legacy: Record<string, string> = {
  snowfall: "holly-ribbon",
  "nordic-pine": "pine-line",
  "velvet-noel": "midnight-gold",
  hearth: "family-table",
  starlight: "glass-ornament",
};

export function GreetingCard({ draft, className }: { draft: CardDraft; className?: string }) {
  const id = legacy[draft.templateId] ?? draft.templateId;
  const recipient = draft.recipientName.trim();
  const greeting = recipient ? `Dear ${recipient},` : "Dear friend,";
  const message = draft.message.trim() || "A Christmas wish, written just for you.";
  const sender = draft.senderName.trim() || "With love";
  const copy = { greeting, message, sender, style: draft.style };

  return (
    <article
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(20,24,18,0.22)]",
        className,
      )}
    >
      {id === "victorian-post" && <Victorian {...copy} />}
      {id === "ivory-type" && <Ivory {...copy} />}
      {id === "pine-line" && <PineLine {...copy} />}
      {id === "colour-block" && <ColourBlock {...copy} />}
      {id === "glass-ornament" && <GlassOrnament {...copy} />}
      {id === "cocoa-mug" && <Cocoa {...copy} />}
      {id === "robin-round" && <Robin {...copy} />}
      {id === "bethlehem-star" && <Bethlehem {...copy} />}
      {id === "midnight-gold" && <Midnight {...copy} />}
      {id === "family-table" && <FamilyTable {...copy} />}
      {id === "nice-list" && <NiceList {...copy} />}
      {!["victorian-post", "ivory-type", "pine-line", "colour-block", "glass-ornament", "cocoa-mug", "robin-round", "bethlehem-star", "midnight-gold", "family-table", "nice-list"].includes(id) && (
        <Holly {...copy} />
      )}
    </article>
  );
}

type Copy = {
  greeting: string;
  message: string;
  sender: string;
  style?: CardDraft["style"];
};

function Words({
  greeting,
  message,
  sender,
  light,
  className,
  style,
}: Copy & { light?: boolean; className?: string }) {
  const font =
    style?.fontStyle === "sans" ? "font-sans" : style?.fontStyle === "script" ? "[font-family:var(--font-script)]" : "font-serif";
  const align = style?.textAlign === "center" ? "items-center text-center" : "items-start text-left";
  const color = style?.textColor;

  return (
    <div className={cn("relative z-10 flex h-full flex-col px-7 py-8", align, className)}>
      <p
        className={cn("text-[1.7rem] leading-none", font, !color && (light ? "text-[#f8f1df]" : "text-[#2a2118]"))}
        style={color ? { color } : undefined}
      >
        {greeting}
      </p>
      <p
        className={cn("mt-4 flex-1 text-[1.15rem] leading-snug", font, !color && (light ? "text-[#f6edd8]/90" : "text-[#2a2118]/80"))}
        style={color ? { color } : undefined}
      >
        {message}
      </p>
      <p
        className="mt-4 text-[11px] uppercase tracking-[0.22em]"
        style={{ color: color ?? (light ? "#e7d3a1" : "#8d2c3b") }}
      >
        {sender}
      </p>
    </div>
  );
}

function Holly(props: Copy) {
  return (
    <div className="h-full bg-[#f4efe4]">
      <div className="absolute inset-x-0 top-0 h-24 bg-[#8d2c3b]" />
      <svg className="absolute left-5 top-4 h-16 w-28" viewBox="0 0 120 70">
        <path d="M20 40c10-22 22-22 28-6 8-18 24-16 28 4 14-4 22 10 12 20H18c-8-8-6-16 2-18z" fill="#1f6b4a" />
        <circle cx="34" cy="28" r="5" fill="#b42334" />
        <circle cx="58" cy="22" r="5" fill="#b42334" />
        <circle cx="78" cy="34" r="4" fill="#b42334" />
      </svg>
      <div className="absolute inset-x-6 bottom-6 top-28 rounded-2xl border border-[#c6a15b]/70 bg-[#fbf7ef]" />
      <Words {...props} className="pt-32" />
    </div>
  );
}

function Victorian(props: Copy) {
  return (
    <div className="h-full bg-[#efe2c8]">
      <div className="absolute inset-4 border-[3px] border-double border-[#6b3a24]" />
      <div className="absolute inset-7 border border-[#6b3a24]/40" />
      <p className="absolute left-0 right-0 top-10 text-center font-serif text-xs tracking-[0.45em] text-[#6b3a24]">POSTED WITH CARE</p>
      <div className="absolute right-10 top-16 h-14 w-14 rotate-6 rounded-full border-2 border-[#8d2c3b] text-center text-[10px] leading-[3.4rem] text-[#8d2c3b]">
        25
      </div>
      <Words {...props} className="pt-24" />
    </div>
  );
}

function Ivory(props: Copy) {
  return (
    <div className="h-full bg-[#f7f4ee]">
      <div className="absolute left-8 right-8 top-10 h-px bg-[#2a2118]/30" />
      <p className="absolute left-8 top-14 text-[10px] uppercase tracking-[0.4em] text-[#2a2118]/50">Christmas</p>
      <Words {...props} className="pt-24" />
    </div>
  );
}

function PineLine(props: Copy) {
  return (
    <div className="h-full bg-[#f3f6f4]">
      <svg className="absolute right-6 top-8 h-40 w-24" viewBox="0 0 80 160">
        <polygon points="40,8 62,58 18,58" fill="none" stroke="#143028" strokeWidth="2" />
        <polygon points="40,40 70,100 10,100" fill="none" stroke="#143028" strokeWidth="2" />
        <polygon points="40,78 74,140 6,140" fill="none" stroke="#143028" strokeWidth="2" />
        <rect x="34" y="140" width="12" height="14" fill="#143028" />
      </svg>
      <Words {...props} />
    </div>
  );
}

function ColourBlock(props: Copy) {
  return (
    <div className="h-full bg-[#f6f1e7]">
      <div className="absolute left-0 top-0 h-2/5 w-full bg-[#143028]" />
      <div className="absolute bottom-0 left-0 h-24 w-24 bg-[#8d2c3b]" />
      <div className="absolute bottom-0 right-0 h-16 w-28 bg-[#c6a15b]" />
      <p className="absolute left-7 top-8 font-serif text-4xl text-[#f8f1df]">Noel</p>
      <Words {...props} className="pt-44" />
    </div>
  );
}

function GlassOrnament(props: Copy) {
  return (
    <div className="h-full bg-[linear-gradient(165deg,#1c3148,#0e1a2b)]">
      <div className="absolute left-1/2 top-8 h-36 w-28 -translate-x-1/2 rounded-full border border-white/40 bg-white/10 shadow-[inset_-12px_-16px_24px_rgba(255,255,255,0.25)]" />
      <div className="absolute left-1/2 top-6 h-3 w-8 -translate-x-1/2 rounded-sm bg-[#c6a15b]" />
      <Words {...props} light className="pt-48" />
    </div>
  );
}

function Cocoa(props: Copy) {
  return (
    <div className="h-full bg-[#f7d7c4]">
      <div className="absolute bottom-16 left-1/2 h-28 w-32 -translate-x-1/2 rounded-b-[40px] rounded-t-lg bg-[#6b3a24]" />
      <div className="absolute bottom-36 left-1/2 h-8 w-24 -translate-x-1/2 rounded-full bg-[#f4efe4]" />
      <div className="absolute bottom-40 left-[42%] h-5 w-5 rounded-full bg-white" />
      <div className="absolute bottom-40 left-1/2 h-5 w-5 rounded-full bg-white" />
      <div className="absolute left-8 top-8 h-10 w-10 rounded-full bg-[#8d2c3b]" />
      <div className="absolute right-8 top-16 h-8 w-8 rounded-full bg-[#143028]" />
      <Words {...props} className="pb-40" />
    </div>
  );
}

function Robin(props: Copy) {
  return (
    <div className="h-full bg-[#e7f0ea]">
      <div className="absolute left-1/2 top-10 h-24 w-28 -translate-x-1/2 rounded-full bg-[#6b3a24]" />
      <div className="absolute left-[58%] top-16 h-16 w-16 rounded-full bg-[#f4efe4]" />
      <div className="absolute left-[64%] top-20 h-8 w-10 rounded-full bg-[#c4483a]" />
      <div className="absolute left-[66%] top-20 h-2 w-2 rounded-full bg-[#241c16]" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#1f6b4a]" />
      <Words {...props} className="pt-40" />
    </div>
  );
}

function Bethlehem(props: Copy) {
  return (
    <div className="h-full bg-[#141a33]">
      <svg className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2" viewBox="0 0 80 80">
        <path d="M40 4l8 24h24l-20 14 8 24-20-14-20 14 8-24L8 28h24z" fill="#e8d7a8" />
      </svg>
      <div className="absolute bottom-0 left-0 h-28 w-full bg-[#2c241c]" />
      <div className="absolute bottom-16 left-10 h-20 w-24 bg-[#1a140f]" style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-16 right-12 h-16 w-20 bg-[#241910]" style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
      <Words {...props} light className="pt-28" />
    </div>
  );
}

function Midnight(props: Copy) {
  return (
    <div className="h-full bg-[#101820]">
      <div className="absolute inset-3 rounded-[22px] border border-[#c6a15b]/80" />
      <div className="absolute inset-5 rounded-[18px] border border-[#c6a15b]/30" />
      <p className="absolute right-8 top-8 text-[#c6a15b]">✦</p>
      <Words {...props} light />
    </div>
  );
}

function FamilyTable(props: Copy) {
  return (
    <div className="h-full bg-[#f6e7cf]">
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[#6b3a24]" />
      <div className="absolute bottom-28 left-8 h-16 w-10 rounded-t-full bg-[#8d2c3b]" />
      <div className="absolute bottom-32 left-24 h-20 w-10 rounded-t-full bg-[#143028]" />
      <div className="absolute bottom-28 right-10 h-16 w-10 rounded-t-full bg-[#c6a15b]" />
      <div className="absolute bottom-24 left-1/2 h-6 w-40 -translate-x-1/2 rounded-full bg-[#fbf7ef]" />
      <Words {...props} className="pb-36" />
    </div>
  );
}

function NiceList(props: Copy) {
  return (
    <div className="h-full bg-[#fffaf2]">
      <div className="absolute left-0 right-0 top-0 bg-[#143028] px-6 py-4 text-center text-[11px] uppercase tracking-[0.28em] text-[#f8f1df]">
        North Pole · Official
      </div>
      <div className="absolute right-6 top-20 rotate-12 border-2 border-[#8d2c3b] px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#8d2c3b]">
        Approved
      </div>
      <p className="absolute left-7 top-24 font-serif text-sm text-[#8d2c3b]">Re: your behaviour this year</p>
      <Words {...props} className="pt-36" />
    </div>
  );
}

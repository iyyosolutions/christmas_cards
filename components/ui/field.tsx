import { cn } from "@/lib/utils";
import { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-pine/70", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-gold",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full resize-y rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink/35 focus:border-gold",
        className,
      )}
      {...props}
    />
  );
}

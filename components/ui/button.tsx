import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium tracking-wide transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#7d8ea8] text-white shadow-sm hover:bg-[#6b7c96]",
        gold: "tape text-[#1f3d3a] hover:brightness-95",
        ghost: "bg-transparent text-ink hover:bg-black/5",
        outline: "border border-dashed border-ink/30 bg-[#fbf8f2] text-ink hover:border-ink/50",
        berry: "bg-[#c45b58] text-white hover:bg-[#a84a47]",
      },
      size: {
        md: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export { buttonVariants };

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

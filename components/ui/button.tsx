import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-pine text-cream shadow-sm hover:bg-pine-deep",
        gold: "bg-gold text-ink hover:bg-gold-soft",
        ghost: "bg-transparent text-pine hover:bg-pine/5",
        outline: "border border-pine/20 bg-cream/70 text-ink hover:border-pine/40",
        berry: "bg-berry text-cream hover:bg-[#742433]",
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

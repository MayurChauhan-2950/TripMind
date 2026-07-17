import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "primary-on-dark" | "secondary-on-dark";

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-pill px-6 py-2.5 font-body text-body-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  // Each variant is fully self-contained (no consumer-side className overrides
  // for bg/border/text) so Tailwind's stylesheet ordering never has to
  // arbitrate between two rules fighting over the same property.
  const variants: Record<Variant, string> = {
    primary: "bg-navy text-paper hover:bg-navy-dark",
    secondary: "bg-transparent border border-navy text-navy hover:border-gold hover:text-gold",
    "primary-on-dark": "bg-gold text-navy hover:bg-gold-light",
    "secondary-on-dark":
      "bg-transparent border border-paper text-paper hover:border-gold hover:text-gold",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

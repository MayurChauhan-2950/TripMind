import type { SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-card border border-stone bg-card px-4 py-2.5 font-body text-body-md text-navy outline-none transition-colors duration-150 focus:border-gold focus:ring-2 focus:ring-gold ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-stone bg-card shadow-[0_1px_3px_rgba(20,33,61,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

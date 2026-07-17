type DotColor = "pine" | "rust" | "harbor" | "gold" | "none";

const DOT_CLASSES: Record<DotColor, string> = {
  pine: "bg-pine",
  rust: "bg-rust",
  harbor: "bg-harbor",
  gold: "bg-gold",
  none: "hidden",
};

export default function Tag({
  children,
  dot = "none",
  className = "",
}: {
  children: React.ReactNode;
  dot?: DotColor;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-tag border border-stone px-2.5 py-1 font-body text-body-sm text-slate ${className}`}
    >
      <span className={`size-1.5 rounded-full ${DOT_CLASSES[dot]}`} />
      {children}
    </span>
  );
}

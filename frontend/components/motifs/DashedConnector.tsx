export default function DashedConnector({
  orientation = "vertical",
  className = "",
}: {
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  if (orientation === "horizontal") {
    return (
      <div
        className={`h-0 flex-1 border-t-2 border-dashed border-gold-light ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={`mx-auto w-0 flex-1 border-l-2 border-dashed border-gold-light ${className}`}
      style={{ minHeight: "32px" }}
      aria-hidden
    />
  );
}

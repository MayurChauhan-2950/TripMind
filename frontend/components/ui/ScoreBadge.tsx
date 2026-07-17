"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export default function ScoreBadge({
  value,
  size = "md",
  className = "",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    if (hasAnimated.current) {
      setDisplayValue(value);
      return;
    }
    hasAnimated.current = true;

    const controls = animate(0, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [value]);

  const sizeClasses = {
    sm: "size-10 text-body-sm",
    md: "size-14 text-body-md",
    lg: "size-20 text-display-md",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 border-gold bg-navy font-mono font-medium text-gold ${sizeClasses[size]} ${className}`}
    >
      {displayValue}
    </div>
  );
}

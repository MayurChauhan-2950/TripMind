import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Destinations",
  description:
    "See two destinations side by side with a data-driven comparison table, plus Gemini's read on which traveler each one suits.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

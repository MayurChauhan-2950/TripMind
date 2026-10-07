import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Calculator",
  description:
    "Pick a destination, trip length, and budget tier — get a deterministic cost breakdown, plus one AI-generated tip to trim it.",
};

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return children;
}

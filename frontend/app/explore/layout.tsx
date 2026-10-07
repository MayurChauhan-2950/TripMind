import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destination Explorer",
  description:
    "Tell us your interests, budget, and season — our recommendation engine scores every destination against what matters to you.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}

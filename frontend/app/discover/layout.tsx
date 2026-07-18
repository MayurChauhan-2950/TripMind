import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hidden Gems & Packing Lists",
  description: "Gemini surfaces lesser-known spots and builds a packing checklist tailored to your trip.",
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}

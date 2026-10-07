import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Itinerary Generator",
  description:
    "Tell us where you're headed and what you're into — Gemini drafts a structured day-by-day itinerary with activities, meals, and notes.",
};

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

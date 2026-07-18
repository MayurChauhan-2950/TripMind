import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Trips",
  description: "Every itinerary you save from the Planner shows up here.",
};

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

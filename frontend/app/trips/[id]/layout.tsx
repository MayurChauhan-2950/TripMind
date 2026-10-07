import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Details",
  description: "View the full day-by-day itinerary for this saved trip.",
};

export default function TripDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}

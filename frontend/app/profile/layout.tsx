import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile",
  description: "Manage your name, home city, bio, and hobbies used to personalize TripMind's AI recommendations.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}

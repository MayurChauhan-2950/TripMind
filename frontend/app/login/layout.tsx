import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to TripMind to save trips and personalize AI recommendations with your travel hobbies.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

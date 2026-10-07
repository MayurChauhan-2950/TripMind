import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free TripMind account to save trips and personalize AI recommendations with your travel hobbies.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}

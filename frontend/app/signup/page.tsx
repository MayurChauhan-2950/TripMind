"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup({ email, username, password, full_name: fullName || null });
      router.push("/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Join TripMind"
        title="Create your account"
        subtext="Add your hobbies to your profile and TripMind's AI will factor them into itineraries, comparisons, and hidden gems."
      />

      <div className="mx-auto max-w-md px-6 py-12 lg:px-16">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-card border border-stone bg-card p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8"
        >
          <div>
            <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
              Full name
            </label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && <p className="font-body text-body-sm text-rust">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </Button>

          <p className="font-body text-body-sm text-slate">
            Already have an account?{" "}
            <Link href="/login" className="text-gold underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

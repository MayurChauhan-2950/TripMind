"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
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
        eyebrow="Welcome back"
        title="Log in to TripMind"
        subtext="Access your saved trips and get itineraries personalized to your profile."
      />

      <div className="mx-auto max-w-md px-6 py-12 lg:px-16">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-card border border-stone bg-card p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8"
        >
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
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="font-body text-body-sm text-rust">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>

          <p className="font-body text-body-sm text-slate">
            No account yet?{" "}
            <Link href="/signup" className="text-gold underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

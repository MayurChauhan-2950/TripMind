"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/context";
import { updateProfile } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUser, logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      setFullName(user.full_name ?? "");
      setHomeCity(user.home_city ?? "");
      setBio(user.bio ?? "");
      setHobbies(user.hobbies);
    }
  }, [user, loading, router]);

  function addHobby() {
    const trimmed = hobbyInput.trim();
    if (trimmed && !hobbies.includes(trimmed)) {
      setHobbies((prev) => [...prev, trimmed]);
    }
    setHobbyInput("");
  }

  function removeHobby(hobby: string) {
    setHobbies((prev) => prev.filter((h) => h !== hobby));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateProfile({ full_name: fullName || null, home_city: homeCity || null, bio: bio || null, hobbies });
      await refreshUser();
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        <p className="font-body text-body-md text-slate">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Your Profile"
        title={`Hi, ${user.full_name || user.username}`}
        subtext="Your hobbies feed directly into the AI Itinerary Generator, Compare, and Hidden Gems — the more specific, the better the personalization."
      />

      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-16">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-card border border-stone bg-card p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
                Full name
              </label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
                Home city
              </label>
              <Input value={homeCity} onChange={(e) => setHomeCity(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-card border border-stone bg-card px-4 py-2.5 font-body text-body-md text-navy outline-none transition-colors duration-150 focus:border-gold focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
              Hobbies
            </label>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <span
                  key={hobby}
                  className="inline-flex items-center gap-1.5 rounded-pill border border-gold bg-navy px-3 py-1 font-body text-body-sm text-gold"
                >
                  {hobby}
                  <button type="button" onClick={() => removeHobby(hobby)} aria-label={`Remove ${hobby}`}>
                    <X className="size-3.5" strokeWidth={2} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHobby();
                  }
                }}
                placeholder="e.g. photography, hiking, street food"
              />
              <Button type="button" variant="secondary" onClick={addHobby}>
                Add
              </Button>
            </div>
          </div>

          {error && <p className="font-body text-body-sm text-rust">{error}</p>}
          {saved && <p className="font-body text-body-sm text-pine">Profile saved.</p>}

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="font-body text-body-sm text-slate underline hover:text-rust"
            >
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

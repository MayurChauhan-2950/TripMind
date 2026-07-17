"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import HiddenGemsPanel from "@/components/discover/HiddenGemsPanel";
import PackingListPanel from "@/components/discover/PackingListPanel";
import { getDestinations } from "@/lib/api/destinations";
import type { Destination } from "@/lib/types";

type Tab = "gems" | "packing";

export default function DiscoverPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tab, setTab] = useState<Tab>("gems");

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]));
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Hidden Gems & Packing Lists"
        title="What the guidebooks leave out"
        subtext="Gemini surfaces lesser-known spots and builds a packing checklist tailored to your trip."
      />

      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        <div className="flex gap-6 border-b border-stone">
          {(["gems", "packing"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 pb-3 font-body text-body-md transition-colors duration-150 ${
                tab === t
                  ? "border-gold text-navy"
                  : "border-transparent text-slate hover:text-navy"
              }`}
            >
              {t === "gems" ? "Hidden Gems" : "Packing List"}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {destinations.length === 0 ? (
            <p className="font-body text-body-md text-slate">Loading destinations…</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {tab === "gems" ? (
                  <HiddenGemsPanel destinations={destinations} />
                ) : (
                  <PackingListPanel destinations={destinations} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

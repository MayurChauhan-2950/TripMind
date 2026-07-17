"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import TrendingDestinations from "@/components/home/TrendingDestinations";
import AIShowcaseBand from "@/components/home/AIShowcaseBand";
import ModuleLinks from "@/components/home/ModuleLinks";
import { getDestinations } from "@/lib/api/destinations";
import type { Destination } from "@/lib/types";

export default function Home() {
  const [trending, setTrending] = useState<Destination[]>([]);

  useEffect(() => {
    getDestinations()
      .then((destinations) => setTrending(destinations.slice(0, 3)))
      .catch(() => setTrending([]));
  }, []);

  return (
    <div>
      <Hero />
      {trending.length > 0 && <TrendingDestinations destinations={trending} />}
      <AIShowcaseBand />
      <ModuleLinks />
    </div>
  );
}

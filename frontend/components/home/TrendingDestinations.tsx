import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import StampedCard from "@/components/motifs/StampedCard";
import RevealOnScroll from "@/components/motifs/RevealOnScroll";
import Tag from "@/components/ui/Tag";
import type { Destination } from "@/lib/types";

export default function TrendingDestinations({ destinations }: { destinations: Destination[] }) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-16">
      <p className="font-body text-label uppercase tracking-[0.04em] text-gold">
        Trending
      </p>
      <h2 className="mt-2 font-display text-display-lg text-navy">Popular destinations</h2>
      <p className="mt-2 font-body text-body-sm text-slate">
        Click any destination to start planning your itinerary.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((dest, index) => (
          <RevealOnScroll key={dest.id} delay={(index % 3) * 0.06}>
            <Link
              href={`/planner?destination=${encodeURIComponent(dest.name)}`}
              className="group block"
            >
              <StampedCard
                stamp={{ type: "icon", icon: MapPin }}
                image={{ src: dest.image_url, alt: dest.name }}
                className="transition-shadow duration-200 group-hover:shadow-[0_4px_16px_rgba(20,33,61,0.12)]"
              >
                <div className="p-5">
                  <p className="font-body text-label uppercase tracking-[0.04em] text-slate">
                    {dest.state}
                  </p>
                  <h3 className="mt-1 font-display text-display-md text-navy group-hover:text-gold transition-colors duration-150">
                    {dest.name}
                  </h3>
                  <p className="mt-2 font-body text-body-sm text-slate line-clamp-2">
                    {dest.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Tag dot={dest.category === "Nature" ? "pine" : "harbor"}>{dest.category}</Tag>
                    <span className="flex items-center gap-1 font-body text-body-sm text-gold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      Plan trip <ArrowRight className="size-3.5" strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </StampedCard>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

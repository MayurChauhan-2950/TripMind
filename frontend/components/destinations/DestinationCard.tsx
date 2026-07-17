import StampedCard from "@/components/motifs/StampedCard";
import Tag from "@/components/ui/Tag";
import type { RecommendResult } from "@/lib/types";

export default function DestinationCard({ result }: { result: RecommendResult }) {
  const { destination, match_score } = result;

  return (
    <StampedCard
      stamp={{ type: "score", value: match_score }}
      image={{ src: destination.image_url, alt: destination.name }}
    >
      <div className="p-5">
        <p className="font-body text-label uppercase tracking-[0.04em] text-slate">
          {destination.state}
        </p>
        <h3 className="mt-1 font-display text-display-md text-navy">{destination.name}</h3>
        <p className="mt-2 font-body text-body-sm text-slate">{destination.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag dot={destination.category === "Nature" ? "pine" : "harbor"}>
            {destination.category}
          </Tag>
          <Tag dot="rust">{destination.budget_level} budget</Tag>
          <Tag dot="harbor">{destination.best_season}</Tag>
        </div>
      </div>
    </StampedCard>
  );
}

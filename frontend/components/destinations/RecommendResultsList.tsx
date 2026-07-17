import DestinationCard from "@/components/destinations/DestinationCard";
import RevealOnScroll from "@/components/motifs/RevealOnScroll";
import type { RecommendResult } from "@/lib/types";

export default function RecommendResultsList({ results }: { results: RecommendResult[] }) {
  if (results.length === 0) {
    return <p className="font-body text-body-md text-slate">No destinations matched yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result, index) => (
        <RevealOnScroll key={result.destination.id} delay={(index % 3) * 0.06}>
          <DestinationCard result={result} />
        </RevealOnScroll>
      ))}
    </div>
  );
}

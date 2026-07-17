import Link from "next/link";
import { Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import DashedConnector from "@/components/motifs/DashedConnector";

export default function AIShowcaseBand() {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-16">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="size-5" strokeWidth={1.75} />
              <p className="font-body text-label uppercase tracking-[0.04em]">AI Itinerary</p>
            </div>
            <h2 className="mt-3 font-display text-display-lg text-paper">
              Your route, mapped day by day
            </h2>
            <p className="mt-3 font-body text-body-lg text-paper/80">
              Tell Gemini where you're headed and what you love — it drafts a structured
              itinerary you can save and revisit anytime.
            </p>
          </div>
          <Link href="/planner">
            <Button variant="primary-on-dark">Generate an itinerary</Button>
          </Link>
        </div>
        <div className="mt-10 hidden items-center gap-3 sm:flex">
          {[1, 2, 3].map((day) => (
            <div key={day} className="flex flex-1 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-gold font-mono text-body-sm text-gold">
                {day}
              </span>
              {day < 3 && <DashedConnector orientation="horizontal" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Calculator, Compass, Gem, Luggage, Scale, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import RevealOnScroll from "@/components/motifs/RevealOnScroll";

const MODULES = [
  {
    href: "/explore",
    icon: Compass,
    title: "Explore",
    description: "Score every destination against your interests, budget, and season.",
  },
  {
    href: "/planner",
    icon: Sparkles,
    title: "Planner",
    description: "Generate a day-by-day AI itinerary with activities, meals, and tips.",
  },
  {
    href: "/budget",
    icon: Calculator,
    title: "Budget",
    description: "Get a transparent cost breakdown plus one AI cost-saving tip.",
  },
  {
    href: "/compare",
    icon: Scale,
    title: "Compare",
    description: "Put two destinations side by side, data table and AI take included.",
  },
  {
    href: "/discover",
    icon: Gem,
    title: "Discover",
    description: "Uncover hidden gems and build a packing list for your trip.",
  },
  {
    href: "/trips",
    icon: Luggage,
    title: "Trips",
    description: "Revisit and manage every itinerary you've saved.",
  },
];

export default function ModuleLinks() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-16">
      <p className="font-body text-label uppercase tracking-[0.04em] text-gold">
        Everything in one place
      </p>
      <h2 className="mt-2 font-display text-display-lg text-navy">Six ways to plan smarter</h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module, index) => (
          <RevealOnScroll key={module.href} delay={(index % 3) * 0.06}>
            <Link href={module.href}>
              <Card className="h-full p-6 transition-colors duration-150 hover:border-gold">
                <module.icon className="size-6 text-gold" strokeWidth={1.75} />
                <h3 className="mt-3 font-display text-display-md text-navy">{module.title}</h3>
                <p className="mt-2 font-body text-body-sm text-slate">{module.description}</p>
              </Card>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

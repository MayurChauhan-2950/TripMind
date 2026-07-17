import Card from "@/components/ui/Card";
import type { BudgetBreakdown } from "@/lib/types";

const ROWS: { key: keyof BudgetBreakdown; label: string }[] = [
  { key: "hotel_total", label: "Hotel" },
  { key: "food_total", label: "Food" },
  { key: "transport_total", label: "Transport" },
  { key: "activities_total", label: "Activities" },
];

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function BudgetBreakdownTable({ breakdown }: { breakdown: BudgetBreakdown }) {
  return (
    <Card className="p-6 sm:p-8">
      <dl className="divide-y divide-stone">
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between py-3">
            <dt className="font-body text-body-md text-slate">{row.label}</dt>
            <dd className="font-mono text-mono-data text-navy">
              {formatInr(breakdown[row.key] as number)}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between py-4">
          <dt className="font-display text-display-md text-navy">Grand total</dt>
          <dd className="font-mono text-display-md text-gold">
            {formatInr(breakdown.grand_total)}
          </dd>
        </div>
      </dl>

      {breakdown.cost_saving_tip && (
        <div className="mt-4 rounded-card border border-dashed border-gold bg-paper p-4">
          <p className="font-body text-label uppercase tracking-[0.04em] text-gold">
            Cost-saving tip
          </p>
          <p className="mt-1 font-body text-body-sm text-navy">{breakdown.cost_saving_tip}</p>
        </div>
      )}
    </Card>
  );
}

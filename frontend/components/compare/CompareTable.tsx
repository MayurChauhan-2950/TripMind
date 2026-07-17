import Card from "@/components/ui/Card";
import type { CompareOut } from "@/lib/types";

export default function CompareTable({ result }: { result: CompareOut }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full font-body text-body-sm">
          <thead>
            <tr className="border-b border-stone bg-paper">
              <th className="px-5 py-3 text-left font-body text-label uppercase tracking-[0.04em] text-slate">
                Metric
              </th>
              <th className="px-5 py-3 text-left font-display text-display-md text-navy">
                {result.destination_a.name}
              </th>
              <th className="px-5 py-3 text-left font-display text-display-md text-navy">
                {result.destination_b.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {result.comparison_table.map((row) => (
              <tr key={row.metric} className="border-b border-stone last:border-0">
                <td className="px-5 py-3 text-slate">{row.metric}</td>
                <td className="px-5 py-3 font-mono text-mono-data text-navy">{row.value_a}</td>
                <td className="px-5 py-3 font-mono text-mono-data text-navy">{row.value_b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

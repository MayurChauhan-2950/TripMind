export default function CompareAISummary({ summary }: { summary: string | null }) {
  if (!summary) {
    return (
      <p className="mt-6 font-body text-body-sm text-slate">
        AI summary unavailable — the comparison table above is unaffected.
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-card border border-dashed border-gold bg-paper p-5">
      <p className="font-body text-label uppercase tracking-[0.04em] text-gold">AI take</p>
      <p className="mt-2 font-body text-body-md text-navy">{summary}</p>
    </div>
  );
}

import type { Interest } from "@/lib/types";

const INTERESTS: { value: Interest; label: string }[] = [
  { value: "nature", label: "Nature" },
  { value: "photography", label: "Photography" },
  { value: "food", label: "Food" },
  { value: "adventure", label: "Adventure" },
  { value: "shopping", label: "Shopping" },
  { value: "history", label: "History" },
];

export default function InterestPicker({
  selected,
  onToggle,
}: {
  selected: Interest[];
  onToggle: (interest: Interest) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {INTERESTS.map((interest) => {
        const active = selected.includes(interest.value);
        return (
          <button
            key={interest.value}
            type="button"
            onClick={() => onToggle(interest.value)}
            className={`rounded-pill border px-4 py-1.5 font-body text-body-sm transition-colors duration-150 ${
              active
                ? "border-gold bg-navy text-gold"
                : "border-stone bg-card text-slate hover:border-gold-light"
            }`}
          >
            {interest.label}
          </button>
        );
      })}
    </div>
  );
}

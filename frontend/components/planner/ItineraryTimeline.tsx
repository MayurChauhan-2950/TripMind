import Card from "@/components/ui/Card";
import type { ItineraryOut } from "@/lib/types";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
};

function getMealEmoji(meal: string) {
  const lower = meal.toLowerCase();
  for (const [key, emoji] of Object.entries(MEAL_LABELS)) {
    if (lower.startsWith(key)) return emoji;
  }
  return "🍽️";
}

export default function ItineraryTimeline({ itinerary }: { itinerary: ItineraryOut }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {itinerary.days.map((day) => (
        <Card key={day.day} className="flex flex-col p-5 sm:p-6">
          {/* Day header */}
          <div className="mb-4 flex items-center gap-3 border-b border-stone pb-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy font-mono text-mono-data font-medium text-gold">
              {day.day}
            </span>
            <h3 className="font-display text-display-md text-navy">Day {day.day}</h3>
          </div>

          {/* Activities */}
          <div className="mb-4">
            <p className="mb-2 font-body text-label uppercase tracking-[0.04em] text-slate">
              Activities
            </p>
            <ul className="flex flex-col gap-1.5">
              {day.activities.map((activity, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-body-sm text-navy">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-gold" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          {/* Meals */}
          <div className="mb-4">
            <p className="mb-2 font-body text-label uppercase tracking-[0.04em] text-slate">
              Meals
            </p>
            <div className="flex flex-col gap-1">
              {day.meals.map((meal, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 rounded-tag border border-stone px-2.5 py-1 font-body text-body-sm text-slate"
                >
                  <span>{getMealEmoji(meal)}</span>
                  {meal}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {day.notes && (
            <div className="mt-auto rounded-tag border border-dashed border-gold/50 bg-gold/5 px-3 py-2">
              <p className="font-body text-body-sm text-navy">
                <span className="mr-1.5 font-medium text-gold">Tip:</span>
                {day.notes}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

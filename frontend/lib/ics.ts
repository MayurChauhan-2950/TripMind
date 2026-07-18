import type { ItineraryDay, TripOut } from "@/lib/types";

function formatIcsDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function dayToEvent(tripId: number, destination: string, day: ItineraryDay, date: Date): string {
  const dtstart = formatIcsDate(date);
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  const dtend = formatIcsDate(nextDate);

  const description = [
    day.activities.length ? `Activities: ${day.activities.join("; ")}` : "",
    day.meals.length ? `Meals: ${day.meals.join("; ")}` : "",
    day.notes ? `Notes: ${day.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "BEGIN:VEVENT",
    `UID:tripmind-${tripId}-day-${day.day}@tripmind`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${escapeIcsText(`Day ${day.day} in ${destination}`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
  ].join("\r\n");
}

export function buildIcsContent(trip: TripOut, startDate: Date): string {
  const events = trip.itinerary.map((day, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return dayToEvent(trip.id, trip.destination, day, date);
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TripMind//Trip Export//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

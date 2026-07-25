import { getWeeks, type Week } from "@/lib/api-client";

/**
 * Fetches all weeks and renders them as a basic, unstyled ordered list with
 * the active week flagged. This is intentionally minimal — restyle freely,
 * the only two things that matter are:
 *   1. week.is_active tells you which one to highlight
 *   2. weeks are sorted by week.week_number before rendering
 *
 * Usage: just drop <WeeklyTimeline /> anywhere in a Server Component page
 * (e.g. app/events/weekly-challanges/page.tsx, next to your leaderboard
 * components). It fetches its own data, no props needed.
 */
export async function WeeklyTimeline() {
  let weeks: Week[] = [];
  try {
    weeks = await getWeeks();
    weeks.sort((a, b) => a.week_number - b.week_number);
  } catch (err) {
    console.error("WeeklyTimeline: failed to fetch weeks:", err);
  }

  if (weeks.length === 0) {
    return <div>No weeks available yet.</div>;
  }

  return (
    <div>
      <h2>Weekly Timeline</h2>
      <ol>
        {weeks.map((week) => (
          <li key={week.id}>
            <strong>Week {week.week_number}:</strong> {week.chapter_name}
            {week.theme ? ` — ${week.theme}` : ""}
            {week.is_active ? " (ACTIVE)" : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
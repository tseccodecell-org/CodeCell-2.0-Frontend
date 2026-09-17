// Every fact about the finale and the internship track lives here, so the page
// itself never needs editing when a date or a venue gets confirmed.

export const QUALIFYING_SEATS = 20;

// Midnight IST on the day itself. Set the real start time here once it is
// fixed and the countdown follows it.
export const FINALE_STARTS_AT = "2026-10-03T00:00:00+05:30";

// Used in running prose, where the full date reads long.
export const FINALE_DATE_SHORT = "3 October";

// Anything left as null renders as an "announced soon" placeholder instead of
// an empty cell, so the page reads as deliberate while details are pending.
export interface FinaleFact {
  label: string;
  value: string | null;
  detail?: string;
  countdownTo?: string;
}

export const FINALE_FACTS: FinaleFact[] = [
  { label: "Date", value: "3 October 2026", detail: "Saturday", countdownTo: FINALE_STARTS_AT },
  { label: "Venue", value: null, detail: "TSEC campus, Bandra" },
  { label: "Format", value: "On-site, individual", detail: "Your machine, our judge" },
  { label: "Duration", value: "3 hours", detail: "Single sitting" },
];

export const FINALE_RULES: { title: string; body: string }[] = [
  {
    title: "You write it there",
    body: "The finale runs on campus, on the clock, with invigilators in the room. No remote entries and no substitutions for a seat you hold.",
  },
  {
    title: "Same judge, harder set",
    body: "The problems run through the CodeCell judge you have used all season. The set is built for twenty people who have already cleared six weeks.",
  },
  {
    title: "Bring a laptop and a college ID",
    body: "Set your environment up before you arrive. Power and network are provided. Your ID is checked against the name on your seat.",
  },
  {
    title: "Ties break on time",
    body: "Score first, then total time to your last accepted solve. The tiebreak is the same one the weekly boards have used since week one.",
  },
];

export interface Partner {
  name: string;
  parent?: string;
  blurb: string;
}

export const PARTNERS: Partner[] = [
  {
    name: "CampusOS",
    parent: "by Engaze",
    blurb:
      "Campus operations software used by colleges across the country. Work on the product students actually log into every day.",
  },
  {
    name: "VisionX",
    blurb:
      "Applied computer vision and machine learning. Ship models into production rather than training them for a notebook.",
  },
];

export const INTERNSHIP_STEPS: { title: string; body: string }[] = [
  {
    title: "Hold a seat",
    body: `Finish the season inside the top ${QUALIFYING_SEATS} on your board. Nothing to apply for at this stage. The leaderboard is the application.`,
  },
  {
    title: "We pass on your profile",
    body: "CodeCell sends each partner your season record: problems cleared, rating, and the languages you actually solved in.",
  },
  {
    title: "You interview directly",
    body: "Partners reach out to the candidates they want. Roles, stipend, and duration are settled between you and them, not through us.",
  },
];

// Applications stay shut until the season is decided. Flip this to true and
// point APPLICATIONS_URL at the form to open them.
export const APPLICATIONS_OPEN = false;
export const APPLICATIONS_URL: string | null = null;

// An ISO timestamp here turns the locked button into a live countdown.
export const APPLICATIONS_OPEN_AT: string | null = null;

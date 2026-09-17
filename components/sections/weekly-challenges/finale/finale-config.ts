// Every fact about the finale and the internship track lives here, so the page
// itself never needs editing when a date or a venue gets confirmed.

export const QUALIFYING_SEATS = 20;

// where everything about the day is announced. only shown to finalists.
export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/HadfP0Rotkh6jb3HLtYEeo";

// Midnight IST on the day itself. Set the real start time here once it is
// fixed and the countdown follows it.
export const FINALE_STARTS_AT = "2026-09-26T00:00:00+05:30";

// Used in running prose, where the full date reads long.
export const FINALE_DATE_SHORT = "26 September";

// Anything left as null renders as an "announced soon" placeholder instead of
// an empty cell, so the page reads as deliberate while details are pending.
export interface FinaleFact {
  label: string;
  value: string | null;
  detail?: string;
  countdownTo?: string;
  href?: string;
}

export const FINALE_FACTS: FinaleFact[] = [
  { label: "Date", value: "26 September 2026", detail: "Saturday", countdownTo: FINALE_STARTS_AT },
  {
    label: "Venue",
    value: "TSEC campus, Bandra",
    detail: "Open in Maps",
    href: "https://maps.app.goo.gl/BRqSgJiYNUy3Dwc76",
  },
  { label: "Format", value: "On-site, individual", detail: "Your machine, our judge" },
  { label: "Duration", value: "2 hours", detail: "Single sitting" },
];

export const FINALE_RULES: { title: string; body: string }[] = [
  {
    title: "Reporting and identification",
    body: "Report to the venue at least thirty minutes before the round begins. Carry your college ID card. Entry is verified against the name on your seat, and a seat cannot be transferred to anyone else.",
  },
  {
    title: "What to bring",
    body: "Bring your own laptop and its charger. Set your development environment up before you arrive, as setup time is not compensated. Power and network access are provided at the venue.",
  },
  {
    title: "Permitted material",
    body: "Only the code templates saved to your CodeCell account are permitted. Templates are reviewed and locked before the round begins. Offline notes, printed material, external storage and second devices are not allowed at your seat.",
  },
  {
    title: "Conduct during the round",
    body: "The round is invigilated. Communication with anyone other than an invigilator, use of a phone, and access to any resource beyond the contest interface are prohibited. Any such attempt ends your participation and forfeits your seat.",
  },
  {
    title: "Judging and scoring",
    body: "Problems are judged by the same CodeCell judge used through the season. Only accepted submissions score. Ties are broken on the total time to your last accepted solution.",
  },
  {
    title: "Interruptions",
    body: "If a machine, the network or the judge fails, raise your hand and wait for an invigilator. Do not attempt to resolve it yourself. Time lost to a verified technical fault is compensated at the organisers' discretion.",
  },
  {
    title: "Leaving the venue",
    body: "You may leave once you have submitted, but re-entry is not permitted after you leave. Remain seated until an invigilator confirms your submissions have been recorded.",
  },
  {
    title: "Final authority",
    body: "The organisers' decision on eligibility, conduct and results is final. Anything not covered here will be decided by the organisers on the day and communicated to everyone present.",
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

// An ISO timestamp here turns the locked button into a live countdown.
export const APPLICATIONS_OPEN_AT: string | null = null;

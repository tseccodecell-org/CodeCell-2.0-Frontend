export const weeklyLeaderboardFixture = {
  week_id: "3f2b1c4d-0000-4000-8000-000000000001",
  page: 1,
  limit: 25,
  total: 2,
  has_next: false,
  data: [
    {
      rank: 1,
      user_id: "178",
      name: "Wilbert",
      weekly_score: 240,
      problems_solved: 2,
      penalty_time: 0,
      best_time_ms: 812,
    },
    {
      rank: 2,
      user_id: "4",
      name: "Mustansir",
      weekly_score: 0,
      problems_solved: 0,
      penalty_time: 0,
      best_time_ms: 0,
    },
  ],
};

export const seasonLeaderboardFixture = {
  page: 1,
  limit: 25,
  total: 1,
  has_next: true,
  data: [
    {
      rank: 1,
      user_id: "178",
      name: "Wilbert",
      season_xp: 540.5,
      final_rating: 1523,
    },
  ],
};

export const weekListFixture = [
  {
    id: "3f2b1c4d-0000-4000-8000-000000000001",
    week_number: 1,
    chapter_name: "Week 1",
    theme: "Arrays",
    description: "Getting started",
    starts_at: "2026-01-05T00:00:00Z",
    ends_at: "2026-01-12T00:00:00Z",
    is_active: true,
    scoring_system: "FULL",
    contest_type: "OPEN",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

export const weekProblemsFixture = [
  {
    id: "aaaa1111-0000-4000-8000-000000000001",
    week_id: "3f2b1c4d-0000-4000-8000-000000000001",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "EASY",
    base_points: 100,
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    solved: true,
    week_ended: false,
  },
];

export const problemDetailFixture = {
  id: "aaaa1111-0000-4000-8000-000000000001",
  title: "Two Sum",
  difficulty: "EASY",
  tags: ["array", "hashmap"],
  description: "Find two numbers that add up to the target.",
  inputFormat: "First line contains n.",
  outputFormat: "Two indices.",
  constraints: "$1 \\le n \\le 10^5$",
  maxScore: 100,
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  examples: [{ input: "2 7 11 15", output: "0 1", explanation: "2 + 7 = 9" }],
  languages: [{ language: "CPP", starterCode: "int main() {}" }],
  weekEnded: false,
};

export const submissionDetailFixture = {
  id: "bbbb2222-0000-4000-8000-000000000001",
  status: "COMPLETED",
  verdict: "ACCEPTED",
  score: 100,
  language: "CPP",
  sourceCode: "int main() {}",
  invalidated: false,
  executionTimeMs: 812,
  memoryUsedKb: 2048,
  submittedAt: "2026-01-06T10:00:00Z",
  judgedAt: "2026-01-06T10:00:04Z",
  testResults: [
    { testCaseId: "tc-1", orderNum: 1, verdict: "ACCEPTED", timeMs: 400, memoryKb: 1024 },
    { testCaseId: "tc-2", orderNum: 2, verdict: "ACCEPTED", timeMs: 412, memoryKb: 1024 },
  ],
};

export const problemSubmissionsFixture = [
  {
    id: "bbbb2222-0000-4000-8000-000000000001",
    status: "COMPLETED",
    verdict: "ACCEPTED",
    score: 100,
    language: "CPP",
    invalidated: false,
    submittedAt: "2026-01-06T10:00:00Z",
  },
];

export const profileFixture = {
  id: 178,
  name: "Wilbert",
  username: "wilbert",
  email: "gamerwilbert7@gmail.com",
  rating: 1523,
  total_problems_solved: 12,
  college_name: "TSEC",
  year: "SE",
  course: "CS",
  location: "Mumbai",
  is_tsec_user: true,
  is_registered: true,
  is_banned: false,
  ban_reason: "",
  banned_at: null,
  warning_count: 0,
  warnings: null,
};

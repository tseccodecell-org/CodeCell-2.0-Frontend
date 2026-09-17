import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FinaleContestPage from "./page";
import { getCurrentFinale, getFinaleProblems, listTemplates } from "@/lib/api-client";

vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-client")>("@/lib/api-client");
  return {
    ...actual,
    getCurrentFinale: vi.fn(),
    getFinaleProblems: vi.fn(),
    listTemplates: vi.fn(),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockedGetCurrentFinale = getCurrentFinale as unknown as ReturnType<typeof vi.fn>;
const mockedGetFinaleProblems = getFinaleProblems as unknown as ReturnType<typeof vi.fn>;
const mockedListTemplates = listTemplates as unknown as ReturnType<typeof vi.fn>;

const baseStatus = {
  weekId: "wk-finale-1",
  accessMode: "OPEN" as const,
  remainingSeconds: 1800,
  scoringActive: true,
  templatesLocked: false,
};

const problem = {
  id: "p-1",
  week_id: "wk-finale-1",
  title: "Palindromic Ladders",
  slug: "palindromic-ladders",
  difficulty: "HARD",
  base_points: 300,
  time_limit_ms: 2000,
  memory_limit_mb: 256,
  solved: false,
  week_ended: false,
};

beforeEach(() => {
  mockedGetFinaleProblems.mockResolvedValue([problem]);
  mockedListTemplates.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("finale contest page", () => {
  it("withholds the problems and counts down while the round has not started", async () => {
    mockedGetCurrentFinale.mockResolvedValue({
      ...baseStatus,
      state: "DRAFT",
      scheduledStartAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    });

    render(<FinaleContestPage />);

    expect(await screen.findByText("The round hasn't started")).toBeVisible();
    expect(screen.getByText("Problems locked")).toBeVisible();
    expect(screen.getByTestId("finale-start-countdown")).toBeVisible();
    expect(screen.queryByText(problem.title)).not.toBeInTheDocument();
    expect(mockedGetFinaleProblems).not.toHaveBeenCalled();
  });

  it("shows the problems and the round timer once it is live", async () => {
    mockedGetCurrentFinale.mockResolvedValue({ ...baseStatus, state: "LIVE" });

    render(<FinaleContestPage />);

    expect(await screen.findByText("The round is live")).toBeVisible();
    expect(await screen.findByText(problem.title)).toBeVisible();
    expect(screen.getByTestId("finale-timer")).toBeVisible();
    expect(screen.queryByTestId("finale-start-countdown")).not.toBeInTheDocument();
  });

  it("drops the timer once the round has ended", async () => {
    mockedGetCurrentFinale.mockResolvedValue({
      ...baseStatus,
      state: "ENDED",
      scoringActive: false,
    });

    render(<FinaleContestPage />);

    expect(await screen.findByText("The round has ended")).toBeVisible();
    expect(screen.queryByTestId("finale-timer")).not.toBeInTheDocument();
  });

  it("keeps the round instructions on the page", async () => {
    mockedGetCurrentFinale.mockResolvedValue({ ...baseStatus, state: "LIVE" });

    render(<FinaleContestPage />);

    expect(await screen.findByText("How the round works")).toBeVisible();
    expect(screen.getByText(/Ties break on total time/)).toBeVisible();
  });

  it("lists the templates the participant brought, read only", async () => {
    mockedGetCurrentFinale.mockResolvedValue({ ...baseStatus, state: "LIVE" });
    mockedListTemplates.mockResolvedValue([
      {
        id: "t-1",
        name: "Fast C++",
        language: "CPP",
        sourceCode: "int main(){}",
        createdAt: "2026-09-16T10:00:00Z",
        updatedAt: "2026-09-16T10:00:00Z",
      },
    ]);

    render(<FinaleContestPage />);

    expect(await screen.findByText("Fast C++")).toBeVisible();
    expect(screen.getByText("int main(){}")).toBeInTheDocument();
    expect(screen.queryByLabelText("Template code")).not.toBeInTheDocument();
  });
});

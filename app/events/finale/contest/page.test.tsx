import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FinaleContestPage from "./page";
import {
  getCurrentFinale,
  getFinaleProblems,
  listTemplates,
  getFinaleBoard,
} from "@/lib/api-client";

vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-client")>("@/lib/api-client");
  return {
    ...actual,
    getCurrentFinale: vi.fn(),
    getFinaleProblems: vi.fn(),
    listTemplates: vi.fn(),
    getFinaleBoard: vi.fn(),
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
const mockedGetFinaleBoard = getFinaleBoard as unknown as ReturnType<typeof vi.fn>;

const baseStatus = {
  weekId: "wk-finale-1",
  accessMode: "OPEN" as const,
  remainingSeconds: 1800,
  scoringActive: true,
  templatesLocked: false,
  entryOpen: true,
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
  mockedGetFinaleBoard.mockResolvedValue([]);
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

  it("keeps the room shut when entry has not been opened", async () => {
    mockedGetCurrentFinale.mockResolvedValue({
      ...baseStatus,
      state: "DRAFT",
      entryOpen: false,
    });

    render(<FinaleContestPage />);

    expect(await screen.findByText("The doors are not open yet")).toBeVisible();
    expect(screen.queryByText("Problems")).not.toBeInTheDocument();
  });

  it("seals the problems while the round has not started", async () => {
    mockedGetCurrentFinale.mockResolvedValue({ ...baseStatus, state: "DRAFT" });

    render(<FinaleContestPage />);

    expect(await screen.findByText("Sealed until the round starts")).toBeVisible();
    expect(screen.queryByText(problem.title)).not.toBeInTheDocument();
  });

  it("shows the seated field on the board before anyone has scored", async () => {
    mockedGetCurrentFinale.mockResolvedValue({ ...baseStatus, state: "DRAFT" });
    mockedGetFinaleBoard.mockResolvedValue([
      { rank: 1, userId: 7, name: "Asha Menon", score: 0, problemsSolved: 0 },
      { rank: 2, userId: 8, name: "Rohit Nair", score: 0, problemsSolved: 0 },
    ]);

    render(<FinaleContestPage />);

    expect(await screen.findByText("Asha Menon")).toBeVisible();
    expect(screen.getByText("Rohit Nair")).toBeVisible();
    expect(screen.queryByText("No seats have been granted yet.")).not.toBeInTheDocument();
  });
});

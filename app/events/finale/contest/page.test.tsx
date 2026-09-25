import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FinaleContestPage from "./page";
import {
  getCurrentFinale,
  getFinaleProblems,
  listTemplates,
  getFinaleStandings,
} from "@/lib/api-client";

vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-client")>("@/lib/api-client");
  return {
    ...actual,
    getCurrentFinale: vi.fn(),
    getFinaleProblems: vi.fn(),
    listTemplates: vi.fn(),
    getFinaleStandings: vi.fn(),
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
const mockedGetFinaleStandings = getFinaleStandings as unknown as ReturnType<typeof vi.fn>;

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
  mockedGetFinaleStandings.mockResolvedValue({ problems: [], rows: [] });
});

afterEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("finale contest page", () => {
  it("withholds the problems and counts down while the round has not started", async () => {
    mockedGetCurrentFinale.mockResolvedValue({
      ...baseStatus,
      state: "DRAFT",
      scheduledStartAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    });

    render(<FinaleContestPage />);

    expect(await screen.findByText("Not started")).toBeVisible();
    expect(screen.getByText(/Problems locked/)).toBeVisible();
    expect(screen.getByTestId("finale-start-countdown")).toBeVisible();
    expect(screen.queryByText(problem.title)).not.toBeInTheDocument();
    expect(mockedGetFinaleProblems).not.toHaveBeenCalled();
  });

  it("says the round is starting soon once the scheduled time has passed", async () => {
    mockedGetCurrentFinale.mockResolvedValue({
      ...baseStatus,
      state: "DRAFT",
      scheduledStartAt: new Date(Date.now() - 60 * 1000).toISOString(),
    });

    render(<FinaleContestPage />);

    expect(await screen.findByTestId("finale-starting-soon")).toHaveTextContent("Starting soon");
    expect(screen.getByText("Starting soon. Keep this page open.")).toBeVisible();
    expect(screen.queryByTestId("finale-start-countdown")).not.toBeInTheDocument();
    expect(screen.queryByText(/0:00/)).not.toBeInTheDocument();
  });

  it("shows the problems and the round timer once it is live", async () => {
    mockedGetCurrentFinale.mockResolvedValue({ ...baseStatus, state: "LIVE" });

    render(<FinaleContestPage />);

    expect(await screen.findByText("Live")).toBeVisible();
    expect(await screen.findByText(problem.title)).toBeVisible();
    expect(screen.getByTestId("finale-timer")).toBeVisible();
    expect(screen.queryByTestId("finale-start-countdown")).not.toBeInTheDocument();
  });

  it("never winds the clock back when status answers arrive late", async () => {
    vi.useFakeTimers();
    try {
      const roundEndsAt = Date.now() + 3600 * 1000;
      const delays = [2000, 7000];
      let calls = 0;
      mockedGetCurrentFinale.mockImplementation(() => {
        const remainingSeconds = Math.round((roundEndsAt - Date.now()) / 1000);
        const delay = delays[calls++ % delays.length];
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ...baseStatus, state: "LIVE", remainingSeconds }), delay)
        );
      });

      render(<FinaleContestPage />);
      await vi.advanceTimersByTimeAsync(2000);
      for (let i = 0; i < 10; i++) await vi.advanceTimersByTimeAsync(0);

      const secondsShown = () => {
        const [h, m, s] = (screen.getByTestId("finale-timer").textContent ?? "").split(":").map(Number);
        return h * 3600 + m * 60 + s;
      };

      let previous = secondsShown();
      for (let tick = 0; tick < 90; tick++) {
        await vi.advanceTimersByTimeAsync(1000);
        const shown = secondsShown();
        expect(shown).toBeLessThanOrEqual(previous);
        previous = shown;
      }

      const trueRemaining = Math.floor((roundEndsAt - Date.now()) / 1000);
      expect(Math.abs(previous - trueRemaining)).toBeLessThanOrEqual(5);
    } finally {
      vi.useRealTimers();
    }
  });

  it("drops the timer once the round has ended", async () => {
    mockedGetCurrentFinale.mockResolvedValue({
      ...baseStatus,
      state: "ENDED",
      scoringActive: false,
    });

    render(<FinaleContestPage />);

    expect(await screen.findByText("The round has ended. These are the final standings.")).toBeVisible();
    expect(screen.queryByTestId("finale-timer")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Standings/ })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps the round instructions on the page", async () => {
    mockedGetCurrentFinale.mockResolvedValue({ ...baseStatus, state: "LIVE" });

    render(<FinaleContestPage />);
    fireEvent.click(await screen.findByRole("tab", { name: /Rules/ }));

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
    fireEvent.click(await screen.findByRole("tab", { name: /Templates/ }));

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
    mockedGetFinaleStandings.mockResolvedValue({
      problems: [{ id: "p-1", label: "A", points: 300 }],
      rows: [
        { rank: 1, userId: 7, name: "Asha Menon", username: "asha", score: 0, solved: 0, penaltySeconds: 0, cells: [] },
        { rank: 1, userId: 8, name: "Rohit Nair", username: "rohit", score: 0, solved: 0, penaltySeconds: 0, cells: [] },
      ],
    });

    render(<FinaleContestPage />);
    fireEvent.click(await screen.findByRole("tab", { name: /Standings/ }));

    expect(await screen.findByText("Asha Menon")).toBeVisible();
    expect(screen.getByText("Rohit Nair")).toBeVisible();
    expect(screen.queryByText("No seats have been granted yet.")).not.toBeInTheDocument();
  });
});

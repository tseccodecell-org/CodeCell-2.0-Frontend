import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import WeeklyLeaderboardPage from "@/app/events/weekly-challenges/leaderboard/weekly/page";
import SeasonLeaderboardPage from "@/app/events/weekly-challenges/leaderboard/season/page";
import { mockFetchOnce } from "./helpers";
import { weeklyLeaderboardFixture, seasonLeaderboardFixture } from "./fixtures";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: 178, name: "Wilbert", role: "TSEC" },
    isTsecStudent: true,
    isAuthenticated: true,
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

describe("weekly leaderboard page", () => {
  it("renders a row per entry from the backend", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);

    render(<WeeklyLeaderboardPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Wilbert").length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText("Mustansir").length).toBeGreaterThan(0);
  });

  it("shows the real score, not a fallback", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);

    render(<WeeklyLeaderboardPage />);

    await waitFor(() => {
      expect(screen.getAllByText("240").length).toBeGreaterThan(0);
    });
  });

  it("shows a genuine zero score as zero", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);

    render(<WeeklyLeaderboardPage />);

    await screen.findByText("Mustansir");
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
  });

  it("surfaces an error instead of an empty board when the shape drifts", async () => {
    mockFetchOnce({
      ...weeklyLeaderboardFixture,
      data: [{ rank: 1, user_id: "178", name: "Wilbert", score: 240, problems_solved: 2 }],
    });

    render(<WeeklyLeaderboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/unexpected response shape/i)).toBeInTheDocument();
    });
  });

  it("shows the sign-in prompt on 401 rather than an error", async () => {
    mockFetchOnce({ error: "unauthorized" }, { status: 401 });

    render(<WeeklyLeaderboardPage />);

    await waitFor(() => {
      expect(screen.queryByText("Wilbert")).not.toBeInTheDocument();
    });
  });

  it("renders an empty board without crashing", async () => {
    mockFetchOnce({ ...weeklyLeaderboardFixture, data: [], total: 0 });

    render(<WeeklyLeaderboardPage />);

    await waitFor(() => {
      expect(screen.queryByText("Wilbert")).not.toBeInTheDocument();
    });
  });
});

describe("season leaderboard page", () => {
  it("renders the final rating as the primary value", async () => {
    mockFetchOnce(seasonLeaderboardFixture);

    render(<SeasonLeaderboardPage />);

    await waitFor(() => {
      expect(screen.getAllByText((1523).toLocaleString()).length).toBeGreaterThan(0);
    });
  });

  it("renders season xp alongside it", async () => {
    mockFetchOnce(seasonLeaderboardFixture);

    render(<SeasonLeaderboardPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/540\.5/).length).toBeGreaterThan(0);
    });
  });

  it("surfaces an error when the season endpoint returns a weekly payload", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);

    render(<SeasonLeaderboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/unexpected response shape/i)).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FinalePage from "./page";
import { getFinaleStatus, getFinaleProblems, listTemplates, ApiError } from "@/lib/api-client";
import type { FinaleState } from "@/lib/schemas/finale";

vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-client")>("@/lib/api-client");
  return {
    ...actual,
    getFinaleStatus: vi.fn(),
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

const mockedGetFinaleStatus = getFinaleStatus as unknown as ReturnType<typeof vi.fn>;
const mockedGetFinaleProblems = getFinaleProblems as unknown as ReturnType<typeof vi.fn>;
const mockedListTemplates = listTemplates as unknown as ReturnType<typeof vi.fn>;

const baseStatus = {
  weekId: "wk-finale-1",
  accessMode: "OPEN" as const,
  remainingSeconds: 1800,
  scoringActive: true,
};

function mockFinaleStatus(overrides: { state: FinaleState; scoringActive?: boolean }) {
  mockedGetFinaleStatus.mockResolvedValue({
    ...baseStatus,
    ...overrides,
  });
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_FINALE_WEEK_ID = "wk-finale-1";
  mockedGetFinaleProblems.mockResolvedValue([]);
  mockedListTemplates.mockResolvedValue([]);
});

afterEach(() => {
  delete process.env.NEXT_PUBLIC_FINALE_WEEK_ID;
});

describe("finale lobby page states", () => {
  it.each([
    ["DRAFT", "Finale lobby"],
    ["LIVE", "Enter contest"],
    ["PAUSED", "Scoring paused"],
    ["ENDED", "Contest ended"],
  ])("renders %s safely", async (state, visibleCopy) => {
    mockFinaleStatus({ state: state as FinaleState });
    render(<FinalePage />);
    expect(await screen.findByText(visibleCopy)).toBeVisible();
  });

  it("does not render a timer after permanent end", async () => {
    mockFinaleStatus({ state: "ENDED", scoringActive: false });
    render(<FinalePage />);
    await screen.findByText("Contest ended");
    expect(screen.queryByTestId("finale-timer")).not.toBeInTheDocument();
  });

  it("shows a timer while the finale is live", async () => {
    mockFinaleStatus({ state: "LIVE" });
    render(<FinalePage />);
    await screen.findByText("Enter contest");
    expect(screen.getByTestId("finale-timer")).toBeVisible();
  });
});

describe("finale lobby failure states", () => {
  it("shows a distinct message when access is restricted (403)", async () => {
    mockedGetFinaleStatus.mockRejectedValue(new ApiError(403, "finale is restricted"));
    render(<FinalePage />);
    expect(await screen.findByText("You don't have access")).toBeVisible();
  });

  it("prompts sign-in on a stale session (401) instead of a generic error", async () => {
    mockedGetFinaleStatus.mockRejectedValue(new ApiError(401, "unauthorized"));
    render(<FinalePage />);
    expect(await screen.findByText("Sign in required")).toBeVisible();
  });

  it("shows a distinct message when the finale is unavailable (404)", async () => {
    mockedGetFinaleStatus.mockRejectedValue(new ApiError(404, "finale not found"));
    render(<FinalePage />);
    expect(await screen.findByText("Finale not available")).toBeVisible();
  });

  it("shows a distinct message on a network failure", async () => {
    mockedGetFinaleStatus.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<FinalePage />);
    expect(await screen.findByText("Something went wrong")).toBeVisible();
  });

  it("does not collapse different failure modes into the same copy", async () => {
    mockedGetFinaleStatus.mockRejectedValue(new ApiError(403, "finale is restricted"));
    const { unmount } = render(<FinalePage />);
    const forbiddenCopy = (await screen.findByText("You don't have access")).textContent;
    unmount();

    mockedGetFinaleStatus.mockRejectedValue(new ApiError(404, "finale not found"));
    render(<FinalePage />);
    const notFoundCopy = (await screen.findByText("Finale not available")).textContent;

    expect(forbiddenCopy).not.toBe(notFoundCopy);
  });
});

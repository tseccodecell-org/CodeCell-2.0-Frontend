import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FinalePage from "./page";
import { getCurrentFinale, getFinaleProblems, listTemplates, ApiError } from "@/lib/api-client";
import type { FinaleState } from "@/lib/schemas/finale";

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

vi.mock("@monaco-editor/react", () => ({
  default: ({
    value,
    onChange,
    language,
  }: {
    value: string;
    onChange: (v: string | undefined) => void;
    language: string;
  }) => (
    <textarea
      aria-label="Template code"
      data-language={language}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockedGetCurrentFinale = getCurrentFinale as unknown as ReturnType<typeof vi.fn>;
const mockedGetFinaleProblems = getFinaleProblems as unknown as ReturnType<typeof vi.fn>;
const mockedListTemplates = listTemplates as unknown as ReturnType<typeof vi.fn>;

const baseStatus = {
  templatesLocked: false,
  weekId: "wk-finale-1",
  accessMode: "OPEN" as const,
  remainingSeconds: 1800,
  scoringActive: true,
};

function mockFinaleStatus(overrides: { state: FinaleState; scoringActive?: boolean }) {
  mockedGetCurrentFinale.mockResolvedValue({
    ...baseStatus,
    ...overrides,
  });
}

beforeEach(() => {
  mockedGetFinaleProblems.mockResolvedValue([]);
  mockedListTemplates.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("finale lobby page states", () => {
  it.each([
    ["DRAFT", "Finale lobby"],
    ["LIVE", "The contest is open"],
    ["PAUSED", "The contest is open"],
    ["ENDED", "The contest is open"],
  ])("renders %s safely", async (state, visibleCopy) => {
    mockFinaleStatus({ state: state as FinaleState });
    render(<FinalePage />);
    expect(await screen.findByText(visibleCopy)).toBeVisible();
  });

  it("freezes the editor once templates are locked for review", async () => {
    mockedGetCurrentFinale.mockResolvedValue({
      ...baseStatus,
      state: "DRAFT",
      templatesLocked: true,
    });
    render(<FinalePage />);

    expect(
      await screen.findByText("Your template library has been locked for review.")
    ).toBeVisible();
    expect(await screen.findByLabelText("Template name")).toHaveAttribute("readonly");
  });

  it("puts the template editor on the lobby itself, with the review rules", async () => {
    mockFinaleStatus({ state: "DRAFT" });
    render(<FinalePage />);
    await screen.findByText("Finale lobby");

    expect(await screen.findByLabelText("Template name")).toBeVisible();
    expect(await screen.findByLabelText("Template code")).toBeVisible();
    expect(mockedListTemplates).toHaveBeenCalled();

    expect(screen.getByText("Bring this")).toBeVisible();
    expect(screen.getByText("Leave this out")).toBeVisible();
    expect(
      screen.getByText(/A solution, or any part of one, to a specific problem/)
    ).toBeVisible();
  });

});

describe("finale lobby failure states", () => {
  it("shows a distinct message when access is restricted (403)", async () => {
    mockedGetCurrentFinale.mockRejectedValue(new ApiError(403, "finale is restricted"));
    render(<FinalePage />);
    expect(await screen.findByText("You don't have access")).toBeVisible();
  });

  it("prompts sign-in on a stale session (401) instead of a generic error", async () => {
    mockedGetCurrentFinale.mockRejectedValue(new ApiError(401, "unauthorized"));
    render(<FinalePage />);
    expect(await screen.findByText("Sign in required")).toBeVisible();
  });

  it("shows a distinct message when the finale is unavailable (404)", async () => {
    mockedGetCurrentFinale.mockRejectedValue(new ApiError(404, "finale not found"));
    render(<FinalePage />);
    expect(await screen.findByText("Finale not available")).toBeVisible();
  });

  it("shows a distinct message on a network failure", async () => {
    mockedGetCurrentFinale.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<FinalePage />);
    expect(await screen.findByText("Something went wrong")).toBeVisible();
  });

  it("does not collapse different failure modes into the same copy", async () => {
    mockedGetCurrentFinale.mockRejectedValue(new ApiError(403, "finale is restricted"));
    const { unmount } = render(<FinalePage />);
    const forbiddenCopy = (await screen.findByText("You don't have access")).textContent;
    unmount();

    mockedGetCurrentFinale.mockRejectedValue(new ApiError(404, "finale not found"));
    render(<FinalePage />);
    const notFoundCopy = (await screen.findByText("Finale not available")).textContent;

    expect(forbiddenCopy).not.toBe(notFoundCopy);
  });
});

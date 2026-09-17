import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import FinaleWorkspace from "./FinaleWorkspace";
import { getFinaleStatus } from "@/lib/api-client";
import type { FinaleState } from "@/lib/schemas/finale";
import { FINALE_BUFFERS_KEY } from "./FinaleLobby";

vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-client")>("@/lib/api-client");
  return {
    ...actual,
    getFinaleStatus: vi.fn(),
    getSubmission: vi.fn(),
    getRun: vi.fn(),
    runCode: vi.fn(),
    submitCode: vi.fn(),
  };
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ isBanned: false }),
}));

// the runtime probe never settles here, it is background chrome for this
// component and a late resolution only produces stray act warnings
vi.mock("@/lib/runtime-api", () => ({
  checkRuntimeHealth: vi.fn(() => new Promise(() => {})),
  getLocalToolchainStatus: vi.fn(() => new Promise(() => {})),
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
      aria-label="Source code"
      data-language={language}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("@/components/sections/weekly-challenges/solve_page/ProblemPanel", async () => {
  const { useEffect } = await vi.importActual<typeof import("react")>("react");
  function ProblemPanelStub({ onLoaded }: { onLoaded?: (problem: unknown) => void }) {
    useEffect(() => {
      if (loadedProblem) onLoaded?.(loadedProblem);
    }, [onLoaded]);
    return <div data-testid="problem-panel" />;
  }
  return { default: ProblemPanelStub };
});

vi.mock("@/components/sections/weekly-challenges/solve_page/SubmissionHistory", () => ({
  default: () => <div data-testid="submission-history" />,
}));

vi.mock("@/components/sections/weekly-challenges/solve_page/VerdictPanel", () => ({
  default: () => <div data-testid="verdict-panel" />,
}));

const mockedGetFinaleStatus = getFinaleStatus as unknown as ReturnType<typeof vi.fn>;

const PROBLEM_ID = "aaaa1111-0000-4000-8000-000000000001";

const problemFixture = {
  id: PROBLEM_ID,
  title: "Two Sum",
  difficulty: "EASY",
  weekId: "wk-finale-1",
  maxScore: 100,
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  languages: [{ language: "CPP", starterCode: "int main() {}" }],
};

let loadedProblem: typeof problemFixture | null = null;

function mockFinaleStatus(state: FinaleState, remainingSeconds = 1800) {
  mockedGetFinaleStatus.mockResolvedValue({
    weekId: "wk-finale-1",
    state,
    accessMode: "RESTRICTED",
    remainingSeconds,
    scoringActive: state === "LIVE",
  });
}

function saveBuffers(buffers: Record<string, string>, activeLanguage: string) {
  sessionStorage.setItem(FINALE_BUFFERS_KEY, JSON.stringify({ buffers, activeLanguage }));
}

function editor() {
  return screen.getByLabelText("Source code") as HTMLTextAreaElement;
}

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  loadedProblem = null;
  mockFinaleStatus("LIVE");
});

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

describe("FinaleWorkspace template hand-off", () => {
  it("opens on the language saved from the template loader, not always CPP", async () => {
    saveBuffers({ CPP: "// cpp template", JAVA: "class Main {}" }, "JAVA");

    render(<FinaleWorkspace problemId={PROBLEM_ID} />);

    await waitFor(() => expect(editor()).toHaveAttribute("data-language", "java"));
    expect(editor()).toHaveValue("class Main {}");
  });

  it("does not ask the participant to confirm an overwrite on the initial load", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    // cached code marks the language as edited, which used to trip the
    // overwrite guard before the tab could switch
    localStorage.setItem(
      `codecell_code_${PROBLEM_ID}`,
      JSON.stringify({ JAVA: "class Main { /* work in progress */ }" })
    );
    saveBuffers({ JAVA: "class Main {}" }, "JAVA");

    render(<FinaleWorkspace problemId={PROBLEM_ID} />);

    await waitFor(() => expect(editor()).toHaveAttribute("data-language", "java"));
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(editor()).toHaveValue("class Main { /* work in progress */ }");
  });

  it("still switches tabs when there are no saved buffers for other languages", async () => {
    saveBuffers({ PYTHON: "print(1)" }, "PYTHON");

    render(<FinaleWorkspace problemId={PROBLEM_ID} />);

    await waitFor(() => expect(editor()).toHaveAttribute("data-language", "python"));
    expect(editor()).toHaveValue("print(1)");
  });

  it("stays on CPP when the loader saved nothing", async () => {
    render(<FinaleWorkspace problemId={PROBLEM_ID} />);

    expect(editor()).toHaveAttribute("data-language", "cpp");
  });

  it("keeps the saved buffers in session storage for the next problem opened", async () => {
    saveBuffers({ JAVA: "class Main {}" }, "JAVA");

    const { unmount } = render(<FinaleWorkspace problemId={PROBLEM_ID} />);
    await waitFor(() => expect(editor()).toHaveAttribute("data-language", "java"));
    unmount();

    expect(sessionStorage.getItem(FINALE_BUFFERS_KEY)).not.toBeNull();

    render(<FinaleWorkspace problemId="bbbb2222-0000-4000-8000-000000000002" />);
    await waitFor(() => expect(editor()).toHaveAttribute("data-language", "java"));
    expect(editor()).toHaveValue("class Main {}");
  });
});

describe("FinaleWorkspace finale status", () => {
  it("shows the timer while the finale is live", async () => {
    loadedProblem = problemFixture;
    mockFinaleStatus("LIVE");

    render(<FinaleWorkspace problemId={PROBLEM_ID} />);

    expect(await screen.findByTestId("finale-timer")).toBeVisible();
  });

  it.each(["DRAFT", "PAUSED", "ENDED"] as FinaleState[])(
    "does not show the timer when the finale is %s",
    async (state) => {
      loadedProblem = problemFixture;
      mockFinaleStatus(state);

      render(<FinaleWorkspace problemId={PROBLEM_ID} />);

      await waitFor(() => expect(mockedGetFinaleStatus).toHaveBeenCalled());
      await screen.findByText("Two Sum");
      expect(screen.queryByTestId("finale-timer")).not.toBeInTheDocument();
    }
  );

  it("does not ask for a status before the problem's week is known", () => {
    loadedProblem = { ...problemFixture, weekId: undefined as unknown as string };

    render(<FinaleWorkspace problemId={PROBLEM_ID} />);

    expect(mockedGetFinaleStatus).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import FocusGuard from "./FocusGuard";
import { reportProctorEvent } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  reportProctorEvent: vi.fn(),
}));

const mockedReport = reportProctorEvent as unknown as ReturnType<typeof vi.fn>;

let fullscreenElement: Element | null = null;
let visibility: DocumentVisibilityState = "visible";

function setFullscreen(on: boolean) {
  fullscreenElement = on ? document.documentElement : null;
  act(() => {
    document.dispatchEvent(new Event("fullscreenchange"));
  });
}

function switchTab() {
  visibility = "hidden";
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
  visibility = "visible";
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

async function enterFullscreen() {
  fireEvent.click(screen.getByRole("button", { name: "Enter full screen" }));
  await act(async () => {});
}

beforeEach(() => {
  vi.clearAllMocks();
  fullscreenElement = null;
  visibility = "visible";
  Object.defineProperty(document, "fullscreenEnabled", { configurable: true, get: () => true });
  Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => fullscreenElement });
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => visibility });
  document.documentElement.requestFullscreen = vi.fn(async () => {
    setFullscreen(true);
  });
});

describe("finale focus guard", () => {
  it("asks for full screen before showing the contest", async () => {
    render(
      <FocusGuard weekId="wk" counting={false}>
        <p>contest</p>
      </FocusGuard>
    );

    expect(screen.getByText("This round runs in full screen")).toBeInTheDocument();
    await enterFullscreen();

    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("reports leaving full screen and shows the strike the server counted", async () => {
    mockedReport.mockResolvedValue({ strikes: 2, strikeLimit: 3, locked: false });
    render(
      <FocusGuard weekId="wk" counting>
        <p>contest</p>
      </FocusGuard>
    );
    await enterFullscreen();

    setFullscreen(false);
    await act(async () => {});

    expect(mockedReport).toHaveBeenCalledWith("wk", "FULLSCREEN_EXIT");
    expect(screen.getByText("You left full screen")).toBeInTheDocument();
    expect(screen.getByTestId("focus-strikes")).toHaveTextContent("Strike 2 of 3");
    expect(screen.getByRole("button", { name: "Return to full screen" })).toBeInTheDocument();
  });

  it("reports a tab switch", async () => {
    mockedReport.mockResolvedValue({ strikes: 1, strikeLimit: 3, locked: false });
    render(
      <FocusGuard weekId="wk" counting>
        <p>contest</p>
      </FocusGuard>
    );
    await enterFullscreen();

    switchTab();
    await act(async () => {});

    expect(mockedReport).toHaveBeenCalledWith("wk", "TAB_SWITCH");
    expect(screen.getByText("You switched away from the contest")).toBeInTheDocument();
  });

  it("locks the screen when the server says the strike limit was reached", async () => {
    mockedReport.mockResolvedValue({
      strikes: 3,
      strikeLimit: 3,
      locked: true,
      lockReason: "Left the contest screen 3 times",
    });
    render(
      <FocusGuard weekId="wk" counting>
        <p>contest</p>
      </FocusGuard>
    );
    await enterFullscreen();

    switchTab();
    await act(async () => {});

    expect(screen.getByText("Your round is locked")).toBeInTheDocument();
    expect(screen.getByTestId("focus-lock-reason")).toHaveTextContent("Left the contest screen 3 times");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("clears the lock when a status poll says an invigilator unlocked them", () => {
    const { rerender } = render(
      <FocusGuard weekId="wk" counting proctor={{ strikes: 3, strikeLimit: 3, locked: true, lockReason: "Phone" }}>
        <p>contest</p>
      </FocusGuard>
    );
    expect(screen.getByText("Your round is locked")).toBeInTheDocument();

    fullscreenElement = document.documentElement;
    rerender(
      <FocusGuard weekId="wk" counting proctor={{ strikes: 0, strikeLimit: 3, locked: false }}>
        <p>contest</p>
      </FocusGuard>
    );

    expect(screen.queryByText("Your round is locked")).not.toBeInTheDocument();
  });

  it("does not report anything before the round is live", async () => {
    render(
      <FocusGuard weekId="wk" counting={false}>
        <p>contest</p>
      </FocusGuard>
    );
    await enterFullscreen();

    switchTab();

    expect(mockedReport).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("still counts on screen when the report cannot reach the server", async () => {
    mockedReport.mockRejectedValue(new Error("offline"));
    render(
      <FocusGuard weekId="wk" counting proctor={{ strikes: 0, strikeLimit: 3, locked: false }}>
        <p>contest</p>
      </FocusGuard>
    );
    await enterFullscreen();

    switchTab();
    await act(async () => {});

    expect(screen.getByTestId("focus-strikes")).toHaveTextContent("Strike 1 of 3");
  });
});

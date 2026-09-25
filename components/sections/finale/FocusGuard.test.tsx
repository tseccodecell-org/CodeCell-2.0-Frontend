import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import FocusGuard from "./FocusGuard";

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

beforeEach(() => {
  fullscreenElement = null;
  visibility = "visible";
  window.localStorage.clear();
  Object.defineProperty(document, "fullscreenEnabled", { configurable: true, get: () => true });
  Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => fullscreenElement });
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => visibility });
  document.documentElement.requestFullscreen = vi.fn(async () => {
    setFullscreen(true);
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("finale focus guard", () => {
  it("asks for full screen before showing the contest", async () => {
    render(
      <FocusGuard weekId="wk" counting={false}>
        <p>contest</p>
      </FocusGuard>
    );

    expect(screen.getByText("This round runs in full screen")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Enter full screen" }));
    await act(async () => {});

    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("counts leaving full screen during the round and asks them back", async () => {
    render(
      <FocusGuard weekId="wk" counting>
        <p>contest</p>
      </FocusGuard>
    );
    fireEvent.click(screen.getByRole("button", { name: "Enter full screen" }));
    await act(async () => {});

    setFullscreen(false);

    expect(screen.getByText("You left full screen")).toBeInTheDocument();
    expect(screen.getByTestId("focus-strikes")).toHaveTextContent("1 time");
    expect(screen.getByRole("button", { name: "Return to full screen" })).toBeInTheDocument();
  });

  it("counts a tab switch that also drops full screen as one slip", async () => {
    render(
      <FocusGuard weekId="wk" counting>
        <p>contest</p>
      </FocusGuard>
    );
    fireEvent.click(screen.getByRole("button", { name: "Enter full screen" }));
    await act(async () => {});

    switchTab();
    setFullscreen(false);

    expect(screen.getByTestId("focus-strikes")).toHaveTextContent("1 time");
  });

  it("does not count anything before the round is live", async () => {
    render(
      <FocusGuard weekId="wk" counting={false}>
        <p>contest</p>
      </FocusGuard>
    );
    fireEvent.click(screen.getByRole("button", { name: "Enter full screen" }));
    await act(async () => {});

    switchTab();

    expect(screen.queryByTestId("focus-strikes")).not.toBeInTheDocument();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("keeps the count when the page is opened again", async () => {
    window.localStorage.setItem("codecell_finale_strikes_wk", "2");
    fullscreenElement = document.documentElement;

    render(
      <FocusGuard weekId="wk" counting>
        <p>contest</p>
      </FocusGuard>
    );
    vi.useFakeTimers();
    vi.advanceTimersByTime(5000);
    switchTab();

    expect(screen.getByTestId("focus-strikes")).toHaveTextContent("3 times");
    fireEvent.click(screen.getByRole("button", { name: "Back to the contest" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import FinaleStandingsTable, { formatContestTime } from "./FinaleStandings";
import type { FinaleStandings } from "@/lib/api-client";

const standings: FinaleStandings = {
  problems: [
    { id: "p-a", label: "A", title: "Ladders", points: 100 },
    { id: "p-b", label: "B", title: "Bridges", points: 200 },
  ],
  rows: [
    {
      rank: 1,
      userId: 7,
      name: "Asha Menon",
      username: "asha",
      score: 300,
      solved: 2,
      penaltySeconds: 2460,
      cells: [
        { problemId: "p-a", solved: true, points: 100, solvedAtSeconds: 600, wrongAttempts: 0, pending: false },
        { problemId: "p-b", solved: true, points: 200, solvedAtSeconds: 2460, wrongAttempts: 2, pending: false },
      ],
    },
    {
      rank: 2,
      userId: 8,
      name: "Rohit Nair",
      username: "rohit",
      score: 200,
      solved: 1,
      penaltySeconds: 1800,
      cells: [
        { problemId: "p-a", solved: false, points: 0, wrongAttempts: 3, pending: true },
        { problemId: "p-b", solved: true, points: 200, solvedAtSeconds: 1800, wrongAttempts: 0, pending: false },
      ],
    },
    {
      rank: 2,
      userId: 9,
      name: "Zed",
      username: "zed",
      score: 200,
      solved: 1,
      penaltySeconds: 1800,
      cells: [],
    },
  ],
};

describe("finale standings table", () => {
  it("gives every problem a lettered column with its points", () => {
    render(<FinaleStandingsTable standings={standings} />);

    const header = screen.getByTitle("A. Ladders");
    expect(header).toHaveTextContent("A");
    expect(header).toHaveTextContent("100");
    expect(screen.getByTitle("B. Bridges")).toHaveTextContent("200");
  });

  it("marks the first solve of each problem and keeps later ones plain", () => {
    render(<FinaleStandingsTable standings={standings} />);

    expect(
      screen.getByLabelText("Problem A solved for 100 points at 10:00, first to solve")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Problem B solved for 200 points at 41:00, after 2 wrong attempts")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Problem B solved for 200 points at 30:00, first to solve")
    ).toBeInTheDocument();
  });

  it("shows wrong tries and a submission still being judged", () => {
    render(<FinaleStandingsTable standings={standings} />);

    expect(
      screen.getByLabelText("Problem A being judged, 3 wrong attempts so far")
    ).toBeInTheDocument();
  });

  it("lets tied participants share a rank and shows the penalty clock", () => {
    render(<FinaleStandingsTable standings={standings} />);

    const rohit = screen.getByRole("rowheader", { name: /Rohit Nair/ }).closest("tr")!;
    const zed = screen.getByRole("rowheader", { name: /Zed/ }).closest("tr")!;
    expect(within(rohit).getAllByRole("cell")[0]).toHaveTextContent("2");
    expect(within(zed).getAllByRole("cell")[0]).toHaveTextContent("2");
    expect(rohit).toHaveTextContent("30:00");
  });

  it("points out your own row", () => {
    render(<FinaleStandingsTable standings={standings} currentUserId="8" />);

    expect(screen.getByTestId("standings-you")).toHaveTextContent("Rohit Nair");
    expect(screen.getByText("(you)")).toBeInTheDocument();
  });

  it("explains an empty board instead of drawing an empty table", () => {
    render(<FinaleStandingsTable standings={{ problems: [], rows: [] }} />);

    expect(screen.getByText("No seats have been granted yet.")).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("formatContestTime", () => {
  it("drops the hour until the round passes one", () => {
    expect(formatContestTime(0)).toBe("0:00");
    expect(formatContestTime(754)).toBe("12:34");
    expect(formatContestTime(3725)).toBe("1:02:05");
  });
});

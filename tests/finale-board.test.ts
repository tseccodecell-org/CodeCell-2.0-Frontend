import { describe, it, expect } from "vitest";
import {
  buildSeats,
  findStanding,
} from "@/components/sections/weekly-challenges/finale/QualifierBoard";
import { QUALIFYING_SEATS } from "@/components/sections/weekly-challenges/finale/finale-config";
import type { SeasonLeaderboardResponse } from "@/lib/types/leaderboard";

type Entries = SeasonLeaderboardResponse["data"];

// Descending XP, matching what the backend returns.
function board(count: number): Entries {
  return Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    user_id: `u${i + 1}`,
    name: `Player ${i + 1}`,
    season_xp: 1000 - i * 10,
    final_rating: 1500 - i,
  }));
}

describe("buildSeats", () => {
  it("always renders exactly the qualifying number of seats", () => {
    expect(buildSeats(board(100), null)).toHaveLength(QUALIFYING_SEATS);
    expect(buildSeats([], null)).toHaveLength(QUALIFYING_SEATS);
  });

  it("leaves seats open when fewer people have scored than there are seats", () => {
    const seats = buildSeats(board(3), null);

    expect(seats[2].name).toBe("Player 3");
    expect(seats[3].name).toBeNull();
    expect(seats[3].rank).toBe(4);
  });

  it("marks the viewer's own seat and nobody else's", () => {
    const seats = buildSeats(board(20), "u7");

    expect(seats.filter((s) => s.isYou)).toHaveLength(1);
    expect(seats[6].isYou).toBe(true);
  });

  it("does not mark a seat when the viewer is outside the cut", () => {
    const seats = buildSeats(board(40), "u30");

    expect(seats.some((s) => s.isYou)).toBe(false);
  });

  it("matches the viewer by value, since ids cross a JSON boundary as strings", () => {
    const entries = board(5);
    const seats = buildSeats(entries, "u3");

    expect(seats[2].isYou).toBe(true);
  });
});

describe("findStanding", () => {
  it("returns nothing for a signed-out viewer", () => {
    expect(findStanding(board(20), null)).toBeNull();
  });

  it("reports a zero gap for someone holding a seat", () => {
    const standing = findStanding(board(40), "u5");

    expect(standing).toEqual({ rank: 5, xp: 960, gap: 0 });
  });

  it("measures the gap against the last qualifying seat, not first place", () => {
    const entries = board(40);
    const cutoff = entries[QUALIFYING_SEATS - 1].season_xp;
    const mine = entries[29].season_xp;

    const standing = findStanding(entries, "u30");

    expect(standing?.rank).toBe(30);
    expect(standing?.gap).toBe(cutoff - mine);
  });

  it("never reports a negative gap", () => {
    const entries = board(40);
    const standing = findStanding(entries, "u40");

    expect(standing?.gap).toBeGreaterThanOrEqual(0);
  });

  it("treats an unscored viewer as needing the whole cutoff", () => {
    const entries = board(40);
    const standing = findStanding(entries, "someone-who-never-submitted");

    expect(standing?.rank).toBeNull();
    expect(standing?.gap).toBe(entries[QUALIFYING_SEATS - 1].season_xp);
  });

  it("has no gap to measure when the board is not full yet", () => {
    const standing = findStanding(board(4), "nobody");

    expect(standing?.gap).toBeNull();
  });
});

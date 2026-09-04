import { describe, it, expect } from "vitest";
import {
  findStanding,
  holdsSeat,
} from "@/components/sections/weekly-challenges/finale/useSeasonStanding";
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

describe("findStanding", () => {
  it("returns nothing for a signed-out viewer", () => {
    expect(findStanding(board(20), null)).toBeNull();
  });

  it("reports a zero gap for someone already inside the cut", () => {
    expect(findStanding(board(40), "u5")).toEqual({ rank: 5, xp: 960, gap: 0 });
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
    expect(findStanding(board(40), "u40")?.gap).toBeGreaterThanOrEqual(0);
  });

  it("treats an unscored viewer as needing the whole cutoff", () => {
    const entries = board(40);
    const standing = findStanding(entries, "someone-who-never-submitted");

    expect(standing?.rank).toBeNull();
    expect(standing?.gap).toBe(entries[QUALIFYING_SEATS - 1].season_xp);
  });

  it("has no gap to measure when the board is not full yet", () => {
    expect(findStanding(board(4), "nobody")?.gap).toBeNull();
  });

  it("matches the viewer by value, since ids cross a JSON boundary as strings", () => {
    expect(findStanding(board(5), "u3")?.rank).toBe(3);
  });
});

describe("holdsSeat", () => {
  it("is false for a signed-out viewer", () => {
    expect(holdsSeat(null)).toBe(false);
  });

  it("is false for someone who has never scored", () => {
    expect(holdsSeat(findStanding(board(40), "nobody"))).toBe(false);
  });

  it("is true on the last qualifying seat and false one past it", () => {
    const entries = board(40);

    expect(holdsSeat(findStanding(entries, `u${QUALIFYING_SEATS}`))).toBe(true);
    expect(holdsSeat(findStanding(entries, `u${QUALIFYING_SEATS + 1}`))).toBe(false);
  });

  it("is true for first place", () => {
    expect(holdsSeat(findStanding(board(40), "u1"))).toBe(true);
  });
});

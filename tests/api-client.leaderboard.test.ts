import { describe, it, expect } from "vitest";
import { getLeaderboard, ApiError } from "@/lib/api-client";
import { SchemaError } from "@/lib/schemas/common";
import { UserRole } from "@/lib/types/leaderboard";
import { mockFetchOnce, lastFetchCall } from "./helpers";
import { weeklyLeaderboardFixture, seasonLeaderboardFixture } from "./fixtures";

const opts = { page: 1, limit: 25 };

describe("getLeaderboard weekly", () => {
  it("parses the real backend payload", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);

    const result = await getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts);

    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe("Wilbert");
    expect(result.data[0].weekly_score).toBe(240);
    expect(result.has_next).toBe(false);
  });

  it("keeps a genuine zero score as zero", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);

    const result = await getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts);

    expect(result.data[1].weekly_score).toBe(0);
    expect(result.data[1].problems_solved).toBe(0);
  });

  it("routes TSEC and GLOBAL to different endpoints", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);
    await getLeaderboard("weekly", UserRole.TSEC, "TSEC", opts);
    expect(lastFetchCall()[0]).toContain("/tsec_student/weekly_leaderboard");

    mockFetchOnce(weeklyLeaderboardFixture);
    await getLeaderboard("weekly", UserRole.OTHER, "GLOBAL", opts);
    expect(lastFetchCall()[0]).toContain("/other/weekly_leaderboard");
  });

  it("sends week_id only when one is supplied", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);
    await getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", { ...opts, weekId: "wk-1" });
    expect(lastFetchCall()[0]).toContain("week_id=wk-1");

    mockFetchOnce(weeklyLeaderboardFixture);
    await getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts);
    expect(lastFetchCall()[0]).not.toContain("week_id");
  });

  it("sends cookies with the request", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);
    await getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts);
    expect(lastFetchCall()[1].credentials).toBe("include");
  });

  it("throws SchemaError when the backend renames a field", async () => {
    const renamed = {
      ...weeklyLeaderboardFixture,
      data: [{ rank: 1, user_id: "178", name: "Wilbert", score: 240, problems_solved: 2 }],
    };
    mockFetchOnce(renamed);

    await expect(
      getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts)
    ).rejects.toBeInstanceOf(SchemaError);
  });

  it("names the offending field in the SchemaError", async () => {
    mockFetchOnce({ ...weeklyLeaderboardFixture, has_next: "nope" });

    await expect(
      getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts)
    ).rejects.toThrow(/has_next/);
  });

  it("throws SchemaError when data is missing entirely", async () => {
    mockFetchOnce({ page: 1, limit: 25, total: 0, has_next: false });

    await expect(
      getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts)
    ).rejects.toBeInstanceOf(SchemaError);
  });

  it("surfaces 403 as an ApiError with status", async () => {
    mockFetchOnce({ error: "forbidden" }, { status: 403 });

    const err = await getLeaderboard("weekly", UserRole.OTHER, "TSEC", opts).catch((e) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(403);
  });

  it("surfaces 401 as an ApiError with status", async () => {
    mockFetchOnce({ error: "unauthorized" }, { status: 401 });

    const err = await getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts).catch((e) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(401);
  });

  it("gives a readable message on gateway errors", async () => {
    mockFetchOnce(undefined, { status: 503 });

    await expect(
      getLeaderboard("weekly", UserRole.TSEC, "GLOBAL", opts)
    ).rejects.toThrow(/temporarily unavailable/);
  });
});

describe("getLeaderboard season", () => {
  it("parses the real backend payload", async () => {
    mockFetchOnce(seasonLeaderboardFixture);

    const result = await getLeaderboard("season", UserRole.TSEC, "GLOBAL", opts);

    expect(result.data[0].final_rating).toBe(1523);
    expect(result.data[0].season_xp).toBe(540.5);
    expect(result.has_next).toBe(true);
  });

  it("accepts user_id as the string the backend actually sends", async () => {
    mockFetchOnce(seasonLeaderboardFixture);

    const result = await getLeaderboard("season", UserRole.TSEC, "GLOBAL", opts);

    expect(result.data[0].user_id).toBe("178");
  });

  it("rejects a weekly payload returned from the season endpoint", async () => {
    mockFetchOnce(weeklyLeaderboardFixture);

    await expect(
      getLeaderboard("season", UserRole.TSEC, "GLOBAL", opts)
    ).rejects.toBeInstanceOf(SchemaError);
  });

  it("never sends week_id", async () => {
    mockFetchOnce(seasonLeaderboardFixture);
    await getLeaderboard("season", UserRole.TSEC, "GLOBAL", { ...opts, weekId: "wk-1" });
    expect(lastFetchCall()[0]).not.toContain("week_id");
  });
});

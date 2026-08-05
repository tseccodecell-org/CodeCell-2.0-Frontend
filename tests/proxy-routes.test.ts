import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as leaderboardGET } from "@/app/api/leaderboard/[...slug]/route";
import { GET as weeksGET } from "@/app/api/weeks/[...slug]/route";
import { weeklyLeaderboardFixture, weekProblemsFixture } from "./fixtures";

const API_BASE = "https://api.test.local";

function request(url: string, headers: Record<string, string> = {}) {
  return new NextRequest(new Request(url, { headers }));
}

function upstream(body: unknown, status = 200) {
  return {
    status,
    text: async () => JSON.stringify(body),
  } as Response;
}

function fetchMock() {
  return globalThis.fetch as ReturnType<typeof vi.fn>;
}

describe("leaderboard proxy route", () => {
  it("forwards to the matching backend path", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weeklyLeaderboardFixture));

    await leaderboardGET(
      request("http://localhost/api/leaderboard/other/weekly_leaderboard"),
      { params: Promise.resolve({ slug: ["other", "weekly_leaderboard"] }) }
    );

    expect(fetchMock().mock.calls[0][0]).toBe(`${API_BASE}/other/weekly_leaderboard`);
  });

  it("carries the query string through", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weeklyLeaderboardFixture));

    await leaderboardGET(
      request("http://localhost/api/leaderboard/other/weekly_leaderboard?page=2&limit=25"),
      { params: Promise.resolve({ slug: ["other", "weekly_leaderboard"] }) }
    );

    expect(fetchMock().mock.calls[0][0]).toContain("page=2");
    expect(fetchMock().mock.calls[0][0]).toContain("limit=25");
  });

  it("forwards the session cookie", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weeklyLeaderboardFixture));

    await leaderboardGET(
      request("http://localhost/api/leaderboard/other/season_leaderboard", {
        cookie: "jwt_token=abc123",
      }),
      { params: Promise.resolve({ slug: ["other", "season_leaderboard"] }) }
    );

    const init = fetchMock().mock.calls[0][1] as { headers: Record<string, string> };
    expect(init.headers.Cookie).toBe("jwt_token=abc123");
  });

  it("does not invent a cookie header when the caller has none", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weeklyLeaderboardFixture));

    await leaderboardGET(
      request("http://localhost/api/leaderboard/other/season_leaderboard"),
      { params: Promise.resolve({ slug: ["other", "season_leaderboard"] }) }
    );

    const init = fetchMock().mock.calls[0][1] as { headers: Record<string, string> };
    expect(init.headers.Cookie).toBeUndefined();
  });

  it("passes the upstream body through unchanged", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weeklyLeaderboardFixture));

    const res = await leaderboardGET(
      request("http://localhost/api/leaderboard/other/weekly_leaderboard"),
      { params: Promise.resolve({ slug: ["other", "weekly_leaderboard"] }) }
    );

    await expect(res.json()).resolves.toEqual(weeklyLeaderboardFixture);
  });

  it("preserves a 401 rather than turning it into a 200", async () => {
    fetchMock().mockResolvedValueOnce(upstream({ error: "unauthorized" }, 401));

    const res = await leaderboardGET(
      request("http://localhost/api/leaderboard/other/weekly_leaderboard"),
      { params: Promise.resolve({ slug: ["other", "weekly_leaderboard"] }) }
    );

    expect(res.status).toBe(401);
  });

  it("preserves a 403", async () => {
    fetchMock().mockResolvedValueOnce(upstream({ error: "forbidden" }, 403));

    const res = await leaderboardGET(
      request("http://localhost/api/leaderboard/tsec_student/weekly_leaderboard"),
      { params: Promise.resolve({ slug: ["tsec_student", "weekly_leaderboard"] }) }
    );

    expect(res.status).toBe(403);
  });

  it("returns 502 when the backend is unreachable", async () => {
    fetchMock().mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const res = await leaderboardGET(
      request("http://localhost/api/leaderboard/other/weekly_leaderboard"),
      { params: Promise.resolve({ slug: ["other", "weekly_leaderboard"] }) }
    );

    expect(res.status).toBe(502);
  });

  it("marks responses no-store so leaderboards are never cached", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weeklyLeaderboardFixture));

    const res = await leaderboardGET(
      request("http://localhost/api/leaderboard/other/weekly_leaderboard"),
      { params: Promise.resolve({ slug: ["other", "weekly_leaderboard"] }) }
    );

    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });
});

describe("weeks proxy route", () => {
  it("prefixes the backend path with /weeks", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weekProblemsFixture));

    await weeksGET(request("http://localhost/api/weeks/wk-1/problems"), {
      params: Promise.resolve({ slug: ["wk-1", "problems"] }),
    });

    expect(fetchMock().mock.calls[0][0]).toBe(`${API_BASE}/weeks/wk-1/problems`);
  });

  it("forwards the session cookie so solved state resolves to the right user", async () => {
    fetchMock().mockResolvedValueOnce(upstream(weekProblemsFixture));

    await weeksGET(
      request("http://localhost/api/weeks/wk-1/problems", { cookie: "jwt_token=abc123" }),
      { params: Promise.resolve({ slug: ["wk-1", "problems"] }) }
    );

    const init = fetchMock().mock.calls[0][1] as { headers: Record<string, string> };
    expect(init.headers.Cookie).toBe("jwt_token=abc123");
  });

  it("returns 502 when the backend is unreachable", async () => {
    fetchMock().mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const res = await weeksGET(request("http://localhost/api/weeks/wk-1/problems"), {
      params: Promise.resolve({ slug: ["wk-1", "problems"] }),
    });

    expect(res.status).toBe(502);
  });
});

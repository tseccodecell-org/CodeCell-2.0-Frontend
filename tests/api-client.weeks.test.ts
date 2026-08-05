import { describe, it, expect } from "vitest";
import { getWeeks, getWeek, getWeekProblems, getProblem } from "@/lib/api-client";
import { SchemaError } from "@/lib/schemas/common";
import { mockFetchOnce, lastFetchCall, envelope } from "./helpers";
import { weekListFixture, weekProblemsFixture, problemDetailFixture } from "./fixtures";

describe("getWeeks", () => {
  it("parses a bare array", async () => {
    mockFetchOnce(weekListFixture);

    const weeks = await getWeeks();

    expect(weeks).toHaveLength(1);
    expect(weeks[0].chapter_name).toBe("Week 1");
  });

  it("parses an enveloped array", async () => {
    mockFetchOnce(envelope(weekListFixture));

    const weeks = await getWeeks();

    expect(weeks[0].week_number).toBe(1);
  });

  it("treats a null list as empty rather than crashing", async () => {
    mockFetchOnce(null);

    await expect(getWeeks()).resolves.toEqual([]);
  });

  it("rejects the legacy title field name", async () => {
    const renamed = [{ ...weekListFixture[0], title: "Week 1", chapter_name: undefined }];
    mockFetchOnce(renamed);

    await expect(getWeeks()).rejects.toBeInstanceOf(SchemaError);
  });

  it("rejects an unknown scoring system", async () => {
    mockFetchOnce([{ ...weekListFixture[0], scoring_system: "HYBRID" }]);

    await expect(getWeeks()).rejects.toBeInstanceOf(SchemaError);
  });

  it("goes through the proxy route, not the backend directly", async () => {
    mockFetchOnce(weekListFixture);
    await getWeeks();
    expect(lastFetchCall()[0]).toBe("/api/weeks");
  });
});

describe("getWeek", () => {
  it("finds a week by id", async () => {
    mockFetchOnce(weekListFixture);

    const week = await getWeek(weekListFixture[0].id);

    expect(week?.chapter_name).toBe("Week 1");
  });

  it("returns null for an unknown id", async () => {
    mockFetchOnce(weekListFixture);

    await expect(getWeek("does-not-exist")).resolves.toBeNull();
  });

  it("returns null rather than throwing when the request fails", async () => {
    mockFetchOnce({ error: "boom" }, { status: 500 });

    await expect(getWeek("anything")).resolves.toBeNull();
  });
});

describe("getWeekProblems", () => {
  it("parses the problem list", async () => {
    mockFetchOnce(weekProblemsFixture);

    const problems = await getWeekProblems("wk-1");

    expect(problems[0].title).toBe("Two Sum");
    expect(problems[0].solved).toBe(true);
  });

  it("preserves solved false without coercing it", async () => {
    mockFetchOnce([{ ...weekProblemsFixture[0], solved: false }]);

    const problems = await getWeekProblems("wk-1");

    expect(problems[0].solved).toBe(false);
  });

  it("preserves a zero base_points after the week ends", async () => {
    mockFetchOnce([{ ...weekProblemsFixture[0], base_points: 0, week_ended: true }]);

    const problems = await getWeekProblems("wk-1");

    expect(problems[0].base_points).toBe(0);
    expect(problems[0].week_ended).toBe(true);
  });

  it("returns an empty list when the week has no published problems", async () => {
    mockFetchOnce([]);

    await expect(getWeekProblems("wk-1")).resolves.toEqual([]);
  });

  it("rejects a row missing the solved flag", async () => {
    const { ...row } = weekProblemsFixture[0];
    delete (row as Record<string, unknown>).solved;
    mockFetchOnce([row]);

    await expect(getWeekProblems("wk-1")).rejects.toBeInstanceOf(SchemaError);
  });
});

describe("getProblem", () => {
  it("parses an enveloped problem", async () => {
    mockFetchOnce(envelope(problemDetailFixture));

    const problem = await getProblem("p-1");

    expect(problem.title).toBe("Two Sum");
    expect(problem.examples).toHaveLength(1);
    expect(problem.languages[0].starterCode).toBe("int main() {}");
  });

  it("turns Go null slices into empty arrays", async () => {
    mockFetchOnce(
      envelope({ ...problemDetailFixture, tags: null, examples: null, languages: null })
    );

    const problem = await getProblem("p-1");

    expect(problem.tags).toEqual([]);
    expect(problem.examples).toEqual([]);
    expect(problem.languages).toEqual([]);
  });

  it("rejects an unenveloped response", async () => {
    mockFetchOnce(problemDetailFixture);

    await expect(getProblem("p-1")).rejects.toThrow();
  });

  it("surfaces 404 as an ApiError", async () => {
    mockFetchOnce({ success: false, error: { code: "NOT_FOUND", message: "no such problem" } }, { status: 404 });

    const err = await getProblem("p-1").catch((e) => e);

    expect(err.status).toBe(404);
    expect(err.message).toBe("no such problem");
  });
});

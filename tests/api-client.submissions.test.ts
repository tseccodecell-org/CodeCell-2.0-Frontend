import { describe, it, expect } from "vitest";
import { getSubmission, getSubmissionHistory, submitCode, getProfile } from "@/lib/api-client";
import { SchemaError } from "@/lib/schemas/common";
import {
  toSubmissionStatus,
  isTerminalStatus,
  isBusyStatus,
} from "@/lib/schemas/submission";
import { mockFetchOnce, envelope } from "./helpers";
import {
  submissionDetailFixture,
  problemSubmissionsFixture,
  profileFixture,
} from "./fixtures";

describe("getSubmission", () => {
  it("parses a completed submission", async () => {
    mockFetchOnce(envelope(submissionDetailFixture));

    const result = await getSubmission("s-1");

    expect(result.verdict).toBe("ACCEPTED");
    expect(result.score).toBe(100);
    expect(result.testResults).toHaveLength(2);
  });

  it("tolerates a queued submission with no timings yet", async () => {
    mockFetchOnce(
      envelope({
        id: "s-2",
        status: "QUEUED",
        verdict: "pending",
        score: 0,
        language: "CPP",
        invalidated: false,
        submittedAt: "2026-01-06T10:00:00Z",
        testResults: null,
      })
    );

    const result = await getSubmission("s-2");

    expect(result.executionTimeMs).toBeUndefined();
    expect(result.testResults).toEqual([]);
  });

  it("preserves a deliberate zero score", async () => {
    mockFetchOnce(envelope({ ...submissionDetailFixture, score: 0 }));

    const result = await getSubmission("s-1");

    expect(result.score).toBe(0);
  });

  it("preserves the invalidated flag", async () => {
    mockFetchOnce(envelope({ ...submissionDetailFixture, invalidated: true, score: 0 }));

    const result = await getSubmission("s-1");

    expect(result.invalidated).toBe(true);
  });

  it("rejects a submission missing its verdict", async () => {
    const row = { ...submissionDetailFixture } as Record<string, unknown>;
    delete row.verdict;
    mockFetchOnce(envelope(row));

    await expect(getSubmission("s-1")).rejects.toBeInstanceOf(SchemaError);
  });
});

describe("getSubmissionHistory", () => {
  it("parses history rows that carry no test results", async () => {
    mockFetchOnce(envelope(problemSubmissionsFixture));

    const rows = await getSubmissionHistory("p-1");

    expect(rows).toHaveLength(1);
    expect(rows[0].verdict).toBe("ACCEPTED");
  });

  it("returns an empty list when the user has never submitted", async () => {
    mockFetchOnce(envelope(null));

    await expect(getSubmissionHistory("p-1")).resolves.toEqual([]);
  });
});

describe("submitCode", () => {
  it("parses the queue acknowledgement", async () => {
    mockFetchOnce(
      envelope({ submissionId: "s-9", status: "QUEUED", queuePosition: 3 })
    );

    const result = await submitCode("p-1", { language: "CPP", sourceCode: "int main(){}" });

    expect(result.submissionId).toBe("s-9");
    expect(result.queuePosition).toBe(3);
  });

  it("accepts an acknowledgement with no queue position", async () => {
    mockFetchOnce(envelope({ submissionId: "s-9", status: "QUEUED" }));

    const result = await submitCode("p-1", { language: "CPP", sourceCode: "int main(){}" });

    expect(result.queuePosition).toBeUndefined();
  });

  it("surfaces a 429 rate limit as an ApiError", async () => {
    mockFetchOnce(
      { success: false, error: { code: "RATE_LIMIT", message: "slow down" } },
      { status: 429 }
    );

    const err = await submitCode("p-1", { language: "CPP", sourceCode: "x" }).catch((e) => e);

    expect(err.status).toBe(429);
    expect(err.message).toBe("slow down");
  });
});

describe("submission status handling", () => {
  it("recognises the PENDING default the database writes", () => {
    expect(toSubmissionStatus("PENDING")).toBe("PENDING");
    expect(isBusyStatus("PENDING")).toBe(true);
    expect(isTerminalStatus("PENDING")).toBe(false);
  });

  it("treats COMPLETED and FAILED as terminal", () => {
    expect(isTerminalStatus("COMPLETED")).toBe(true);
    expect(isTerminalStatus("FAILED")).toBe(true);
  });

  it("does not treat QUEUED or RUNNING as terminal", () => {
    expect(isTerminalStatus("QUEUED")).toBe(false);
    expect(isTerminalStatus("RUNNING")).toBe(false);
  });

  it("is case insensitive", () => {
    expect(toSubmissionStatus("completed")).toBe("COMPLETED");
    expect(isTerminalStatus("completed")).toBe(true);
  });

  it("keeps polling on an unrecognised status instead of declaring failure", () => {
    expect(toSubmissionStatus("COMPILING")).toBe("RUNNING");
    expect(isTerminalStatus("COMPILING")).toBe(false);
  });
});

describe("getProfile", () => {
  it("parses the profile", async () => {
    mockFetchOnce(envelope(profileFixture));

    const profile = await getProfile();

    expect(profile?.email).toBe("gamerwilbert7@gmail.com");
    expect(profile?.is_tsec_user).toBe(true);
  });

  it("turns a null warnings slice into an empty array", async () => {
    mockFetchOnce(envelope(profileFixture));

    const profile = await getProfile();

    expect(profile?.warnings).toEqual([]);
  });

  it("returns null when signed out rather than throwing", async () => {
    mockFetchOnce({ error: "unauthorized" }, { status: 401 });

    await expect(getProfile()).resolves.toBeNull();
  });

  it("rejects a profile missing the ban fields", async () => {
    const row = { ...profileFixture } as Record<string, unknown>;
    delete row.is_banned;
    mockFetchOnce(envelope(row));

    await expect(getProfile()).rejects.toBeInstanceOf(SchemaError);
  });
});

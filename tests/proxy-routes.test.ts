import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as leaderboardGET } from "@/app/api/leaderboard/[...slug]/route";
import { GET as weeksGET } from "@/app/api/weeks/[...slug]/route";
import { GET as finalesGET, POST as finalesPOST } from "@/app/api/finales/[...slug]/route";
import {
  GET as templatesGET,
  POST as templatesPOST,
  PUT as templatesPUT,
  DELETE as templatesDELETE,
} from "@/app/api/templates/[[...slug]]/route";
import {
  weeklyLeaderboardFixture,
  weekProblemsFixture,
  finaleStatusFixture,
  templateFixture,
} from "./fixtures";

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

function bodyRequest(
  url: string,
  method: string,
  body: unknown,
  headers: Record<string, string> = {}
) {
  return new NextRequest(
    new Request(url, {
      method,
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    })
  );
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

describe("finales proxy route", () => {
  it("forwards a proctoring report with its body and the session cookie", async () => {
    fetchMock().mockResolvedValueOnce(upstream({ success: true, data: { strikes: 1, strikeLimit: 3, locked: false } }));

    const req = new NextRequest(
      new Request("http://localhost/api/finales/wk-1/proctor-events", {
        method: "POST",
        headers: { cookie: "jwt_token=abc123", "content-type": "application/json" },
        body: JSON.stringify({ kind: "TAB_SWITCH" }),
      })
    );
    const res = await finalesPOST(req, { params: Promise.resolve({ slug: ["wk-1", "proctor-events"] }) });

    const [url, init] = fetchMock().mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/finales/wk-1/proctor-events`);
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ kind: "TAB_SWITCH" }));
    expect(init.headers.Cookie).toBe("jwt_token=abc123");
    expect(res.status).toBe(200);
  });

  it("prefixes the backend path with /finales", async () => {
    fetchMock().mockResolvedValueOnce(upstream(finaleStatusFixture));

    await finalesGET(request("http://localhost/api/finales/wk-1/status"), {
      params: Promise.resolve({ slug: ["wk-1", "status"] }),
    });

    expect(fetchMock().mock.calls[0][0]).toBe(`${API_BASE}/api/finales/wk-1/status`);
  });

  it("carries the query string through", async () => {
    fetchMock().mockResolvedValueOnce(upstream(finaleStatusFixture));

    await finalesGET(request("http://localhost/api/finales/wk-1/problems?page=2"), {
      params: Promise.resolve({ slug: ["wk-1", "problems"] }),
    });

    expect(fetchMock().mock.calls[0][0]).toContain("page=2");
  });

  it("forwards the session cookie so finale access resolves to the right user", async () => {
    fetchMock().mockResolvedValueOnce(upstream(finaleStatusFixture));

    await finalesGET(
      request("http://localhost/api/finales/wk-1/status", { cookie: "jwt_token=abc123" }),
      { params: Promise.resolve({ slug: ["wk-1", "status"] }) }
    );

    const init = fetchMock().mock.calls[0][1] as { headers: Record<string, string> };
    expect(init.headers.Cookie).toBe("jwt_token=abc123");
  });

  it("does not invent a cookie header when the caller has none", async () => {
    fetchMock().mockResolvedValueOnce(upstream(finaleStatusFixture));

    await finalesGET(request("http://localhost/api/finales/wk-1/status"), {
      params: Promise.resolve({ slug: ["wk-1", "status"] }),
    });

    const init = fetchMock().mock.calls[0][1] as { headers: Record<string, string> };
    expect(init.headers.Cookie).toBeUndefined();
  });

  it("passes the upstream body through unchanged", async () => {
    fetchMock().mockResolvedValueOnce(upstream(finaleStatusFixture));

    const res = await finalesGET(request("http://localhost/api/finales/wk-1/status"), {
      params: Promise.resolve({ slug: ["wk-1", "status"] }),
    });

    await expect(res.json()).resolves.toEqual(finaleStatusFixture);
  });

  it("preserves a 403 so restricted access is not read as an empty finale", async () => {
    fetchMock().mockResolvedValueOnce(upstream({ error: "forbidden" }, 403));

    const res = await finalesGET(request("http://localhost/api/finales/wk-1/status"), {
      params: Promise.resolve({ slug: ["wk-1", "status"] }),
    });

    expect(res.status).toBe(403);
  });

  it("returns 502 when the backend is unreachable", async () => {
    fetchMock().mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const res = await finalesGET(request("http://localhost/api/finales/wk-1/status"), {
      params: Promise.resolve({ slug: ["wk-1", "status"] }),
    });

    expect(res.status).toBe(502);
  });

  it("marks responses no-store so a paused or ended finale is never cached", async () => {
    fetchMock().mockResolvedValueOnce(upstream(finaleStatusFixture));

    const res = await finalesGET(request("http://localhost/api/finales/wk-1/status"), {
      params: Promise.resolve({ slug: ["wk-1", "status"] }),
    });

    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });
});

describe("templates proxy route", () => {
  it("prefixes the backend path with /templates", async () => {
    fetchMock().mockResolvedValueOnce(upstream([templateFixture]));

    await templatesGET(request("http://localhost/api/templates"), {
      params: Promise.resolve({ slug: [] }),
    });

    expect(fetchMock().mock.calls[0][0]).toBe(`${API_BASE}/api/templates`);
  });

  // the bare /api/templates path gives the handler no slug at all. a required
  // catch-all never matched it, so creating a template 404d before this route
  // was ever reached
  it("handles the bare collection path, where the router supplies no slug", async () => {
    fetchMock().mockResolvedValueOnce(upstream([templateFixture]));

    await templatesGET(request("http://localhost/api/templates"), {
      params: Promise.resolve({ slug: undefined }),
    });

    expect(fetchMock().mock.calls[0][0]).toBe(`${API_BASE}/api/templates`);
  });

  it("creates a template on the bare collection path", async () => {
    fetchMock().mockResolvedValueOnce(upstream(templateFixture));

    const res = await templatesPOST(
      request("http://localhost/api/templates", {
        method: "POST",
        body: JSON.stringify({ name: "Fast C++", language: "CPP", sourceCode: "int main(){}" }),
      }),
      { params: Promise.resolve({ slug: undefined }) }
    );

    expect(fetchMock().mock.calls[0][0]).toBe(`${API_BASE}/api/templates`);
    expect(res.status).toBe(200);
  });

  it("appends the slug when a single template is addressed", async () => {
    fetchMock().mockResolvedValueOnce(upstream(templateFixture));

    await templatesGET(request(`http://localhost/api/templates/${templateFixture.id}`), {
      params: Promise.resolve({ slug: [templateFixture.id] }),
    });

    expect(fetchMock().mock.calls[0][0]).toBe(`${API_BASE}/api/templates/${templateFixture.id}`);
  });

  it("forwards the session cookie", async () => {
    fetchMock().mockResolvedValueOnce(upstream([templateFixture]));

    await templatesGET(request("http://localhost/api/templates", { cookie: "jwt_token=abc123" }), {
      params: Promise.resolve({ slug: [] }),
    });

    const init = fetchMock().mock.calls[0][1] as { headers: Record<string, string> };
    expect(init.headers.Cookie).toBe("jwt_token=abc123");
  });

  it("passes the upstream body through unchanged", async () => {
    fetchMock().mockResolvedValueOnce(upstream([templateFixture]));

    const res = await templatesGET(request("http://localhost/api/templates"), {
      params: Promise.resolve({ slug: [] }),
    });

    await expect(res.json()).resolves.toEqual([templateFixture]);
  });

  it("forwards the POST body when a template is created", async () => {
    fetchMock().mockResolvedValueOnce(upstream(templateFixture, 201));

    const payload = { name: "Fast C++", language: "CPP", sourceCode: "int main(){}" };
    const res = await templatesPOST(
      bodyRequest("http://localhost/api/templates", "POST", payload),
      { params: Promise.resolve({ slug: [] }) }
    );

    const [url, init] = fetchMock().mock.calls[0] as [
      string,
      { method: string; body: string; headers: Record<string, string> },
    ];
    expect(url).toBe(`${API_BASE}/api/templates`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual(payload);
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(res.status).toBe(201);
  });

  it("forwards the PUT body when a template is updated", async () => {
    fetchMock().mockResolvedValueOnce(upstream(templateFixture));

    const payload = { name: "Fast C++ v2", language: "CPP", sourceCode: "int main(){return 0;}" };
    await templatesPUT(
      bodyRequest(`http://localhost/api/templates/${templateFixture.id}`, "PUT", payload),
      { params: Promise.resolve({ slug: [templateFixture.id] }) }
    );

    const [url, init] = fetchMock().mock.calls[0] as [string, { method: string; body: string }];
    expect(url).toBe(`${API_BASE}/api/templates/${templateFixture.id}`);
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual(payload);
  });

  it("forwards a DELETE to the template's own path", async () => {
    fetchMock().mockResolvedValueOnce(upstream({ success: true }, 200));

    const res = await templatesDELETE(
      request(`http://localhost/api/templates/${templateFixture.id}`),
      { params: Promise.resolve({ slug: [templateFixture.id] }) }
    );

    const [url, init] = fetchMock().mock.calls[0] as [string, { method: string }];
    expect(url).toBe(`${API_BASE}/api/templates/${templateFixture.id}`);
    expect(init.method).toBe("DELETE");
    expect(res.status).toBe(200);
  });

  it("preserves a 400 rather than passing it off as a successful save", async () => {
    fetchMock().mockResolvedValueOnce(
      upstream({ error: { code: "TEMPLATE_NAME_REQUIRED" } }, 400)
    );

    const res = await templatesPOST(
      bodyRequest("http://localhost/api/templates", "POST", { name: "" }),
      { params: Promise.resolve({ slug: [] }) }
    );

    expect(res.status).toBe(400);
  });

  it("returns 502 when the backend is unreachable", async () => {
    fetchMock().mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const res = await templatesGET(request("http://localhost/api/templates"), {
      params: Promise.resolve({ slug: [] }),
    });

    expect(res.status).toBe(502);
  });

  it("marks responses no-store so a stale template list is never served", async () => {
    fetchMock().mockResolvedValueOnce(upstream([templateFixture]));

    const res = await templatesGET(request("http://localhost/api/templates"), {
      params: Promise.resolve({ slug: [] }),
    });

    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });
});

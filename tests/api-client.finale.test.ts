import { describe, it, expect } from "vitest";
import {
  getFinaleStatus,
  getFinaleProblems,
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  ApiError,
  getCurrentFinale,
} from "@/lib/api-client";
import { SchemaError } from "@/lib/schemas/common";
import { mockFetchOnce, lastFetchCall, envelope } from "./helpers";
import { finaleStatusFixture, templateFixture, weekProblemsFixture } from "./fixtures";

describe("getFinaleStatus", () => {
  it("parses a well-formed status response", async () => {
    mockFetchOnce(envelope(finaleStatusFixture));

    const status = await getFinaleStatus("wk-1");

    expect(status.state).toBe("LIVE");
    expect(status.accessMode).toBe("RESTRICTED");
    expect(status.remainingSeconds).toBe(1800);
    expect(status.scoringActive).toBe(true);
    expect(status.liveSince).toBe("2026-09-16T12:00:00Z");
  });

  it("allows liveSince to be omitted", async () => {
    const { liveSince: _liveSince, ...rest } = finaleStatusFixture;
    mockFetchOnce(envelope({ ...rest, state: "DRAFT" }));

    const status = await getFinaleStatus("wk-1");

    expect(status.liveSince).toBeUndefined();
    expect(status.state).toBe("DRAFT");
  });

  it("rejects a finale response without a valid lifecycle state", async () => {
    mockFetchOnce(envelope({ ...finaleStatusFixture, state: "BROKEN" }));

    await expect(getFinaleStatus("wk-1")).rejects.toThrow();
  });

  it("rejects an unknown access mode", async () => {
    mockFetchOnce(envelope({ ...finaleStatusFixture, accessMode: "SEMI_OPEN" }));

    await expect(getFinaleStatus("wk-1")).rejects.toBeInstanceOf(SchemaError);
  });

  it("goes through the finale proxy route, not the backend directly", async () => {
    mockFetchOnce(envelope(finaleStatusFixture));
    await getFinaleStatus("wk-1");
    expect(lastFetchCall()[0]).toBe("/api/finales/wk-1/status");
  });

  it("surfaces a 403 FINALE_NOT_LIVE as an ApiError", async () => {
    mockFetchOnce(
      { success: false, error: { code: "FINALE_NOT_LIVE", message: "finale is not live" } },
      { status: 403 }
    );

    const err = await getFinaleStatus("wk-1").catch((e) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(403);
    expect(err.code).toBe("FINALE_NOT_LIVE");
  });
});

describe("getFinaleProblems", () => {
  it("parses the problem list", async () => {
    mockFetchOnce(envelope(weekProblemsFixture));

    const problems = await getFinaleProblems("wk-1");

    expect(problems[0].title).toBe("Two Sum");
  });

  it("preserves the always-false solved placeholder", async () => {
    mockFetchOnce(envelope([{ ...weekProblemsFixture[0], solved: false }]));

    const problems = await getFinaleProblems("wk-1");

    expect(problems[0].solved).toBe(false);
  });

  it("rejects a row missing a required field", async () => {
    const { difficulty: _difficulty, ...row } = weekProblemsFixture[0];
    mockFetchOnce(envelope([row]));

    await expect(getFinaleProblems("wk-1")).rejects.toBeInstanceOf(SchemaError);
  });

  it("goes through the finale proxy route", async () => {
    mockFetchOnce(envelope(weekProblemsFixture));
    await getFinaleProblems("wk-1");
    expect(lastFetchCall()[0]).toBe("/api/finales/wk-1/problems");
  });
});

describe("listTemplates", () => {
  it("parses the template list", async () => {
    mockFetchOnce(envelope([templateFixture]));

    const templates = await listTemplates();

    expect(templates).toHaveLength(1);
    expect(templates[0].name).toBe("Fast C++");
    expect(templates[0].language).toBe("CPP");
  });

  it("treats a null list as empty", async () => {
    mockFetchOnce(envelope(null));

    await expect(listTemplates()).resolves.toEqual([]);
  });

  it("rejects an unknown language", async () => {
    mockFetchOnce(envelope([{ ...templateFixture, language: "RUST" }]));

    await expect(listTemplates()).rejects.toBeInstanceOf(SchemaError);
  });

  it("goes through the templates proxy route", async () => {
    mockFetchOnce(envelope([templateFixture]));
    await listTemplates();
    expect(lastFetchCall()[0]).toBe("/api/templates");
  });
});

describe("createTemplate", () => {
  it("posts the template body to the proxy route", async () => {
    mockFetchOnce(envelope(templateFixture));

    const created = await createTemplate({
      name: "Fast C++",
      language: "CPP",
      sourceCode: "int main(){}",
    });

    expect(created.id).toBe(templateFixture.id);
    const [url, init] = lastFetchCall();
    expect(url).toBe("/api/templates");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Fast C++",
      language: "CPP",
      sourceCode: "int main(){}",
    });
  });

  it("surfaces a 400 TEMPLATE_NAME_REQUIRED as an ApiError", async () => {
    mockFetchOnce(
      { success: false, error: { code: "TEMPLATE_NAME_REQUIRED", message: "name required" } },
      { status: 400 }
    );

    const err = await createTemplate({ name: "", language: "CPP", sourceCode: "" }).catch(
      (e) => e
    );

    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toBe("TEMPLATE_NAME_REQUIRED");
  });
});

describe("updateTemplate", () => {
  it("sends a template update only through its proxy route", async () => {
    mockFetchOnce(envelope(templateFixture));

    await updateTemplate("template-1", {
      name: "Fast C++",
      language: "CPP",
      sourceCode: "int main(){}",
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/templates/template-1",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("surfaces a 404 TEMPLATE_NOT_FOUND as an ApiError", async () => {
    mockFetchOnce(
      { success: false, error: { code: "TEMPLATE_NOT_FOUND", message: "not found" } },
      { status: 404 }
    );

    const err = await updateTemplate("missing", {
      name: "x",
      language: "CPP",
      sourceCode: "x",
    }).catch((e) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(404);
  });
});

describe("deleteTemplate", () => {
  it("sends a DELETE to the proxy route with the template id", async () => {
    mockFetchOnce({ success: true });

    const result = await deleteTemplate("template-1");

    expect(result).toEqual({ success: true });
    const [url, init] = lastFetchCall();
    expect(url).toBe("/api/templates/template-1");
    expect(init.method).toBe("DELETE");
  });

  it("surfaces a 404 as an ApiError", async () => {
    mockFetchOnce(
      { success: false, error: { code: "TEMPLATE_NOT_FOUND", message: "not found" } },
      { status: 404 }
    );

    const err = await deleteTemplate("missing").catch((e) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(404);
  });
});

describe("getCurrentFinale", () => {
  it("asks the backend which finale is current instead of a build-time id", async () => {
    mockFetchOnce(envelope(finaleStatusFixture));

    await getCurrentFinale();

    expect(lastFetchCall()[0]).toBe("/api/finales/current");
  });

  it("carries the week id the rest of the lobby works from", async () => {
    mockFetchOnce(envelope(finaleStatusFixture));

    const status = await getCurrentFinale();

    expect(status.weekId).toBe(finaleStatusFixture.weekId);
  });
});

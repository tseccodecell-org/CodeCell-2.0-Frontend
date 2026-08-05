import type { SubmitRequest, RunRequest, RunResponse, RunResult } from "./types/submission";
import {
  LeaderboardKind,
  LeaderboardTab,
  UserRole,
  WeeklyLeaderboardResponse,
  SeasonLeaderboardResponse,
} from "./types/leaderboard";
import { z } from "zod";
import { parseOrThrow } from "./schemas/common";
import {
  weeklyLeaderboardResponseSchema,
  seasonLeaderboardResponseSchema,
} from "./schemas/leaderboard";
import { weekListSchema, weekProblemListSchema } from "./schemas/week";
import { problemDetailSchema } from "./schemas/problem";
import { userProfileSchema } from "./schemas/profile";
import {
  submitResponseSchema,
  submissionDetailSchema,
  problemSubmissionListSchema,
} from "./schemas/submission";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type { Week, WeekProblem } from "./schemas/week";
export type { ProblemDetail, ProblemExample, ProblemLanguageConfig } from "./schemas/problem";
export type { UserProfile, ProfileWarning } from "./schemas/profile";
export type {
  SubmitResponse,
  SubmissionDetail,
  ProblemSubmission,
  SubmissionTestResult,
} from "./schemas/submission";
export { SchemaError } from "./schemas/common";

import type { Week, WeekProblem } from "./schemas/week";
import type { ProblemDetail } from "./schemas/problem";
import type { UserProfile } from "./schemas/profile";
import type {
  SubmitResponse,
  SubmissionDetail,
  ProblemSubmission,
} from "./schemas/submission";

export type EventStatus = "UPCOMING" | "LIVE" | "ENDED";

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
}

const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["UPCOMING", "LIVE", "ENDED"]),
});

const eventListSchema = z
  .array(eventSchema)
  .nullable()
  .transform((value) => value ?? []);

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { message: string; code?: string };
}

class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function errorFrom(res: Response, body: unknown): ApiError {
  const shape = body as { error?: unknown };

  if (typeof shape?.error === "string") {
    return new ApiError(res.status, shape.error);
  }

  const enveloped = shape?.error as { message?: string; code?: string } | undefined;
  if (enveloped?.message) {
    return new ApiError(res.status, enveloped.message, enveloped.code);
  }

  if (res.status >= 502 && res.status <= 504) {
    return new ApiError(
      res.status,
      "The server is temporarily unavailable. Please try again in a moment."
    );
  }

  return new ApiError(res.status, res.statusText || "Request failed");
}

async function apiGetEnveloped<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  baseUrl?: string
): Promise<z.infer<T>> {
  const urlBase = baseUrl ?? BASE_URL;
  if (!urlBase) throw new ApiError(0, "API base URL is not set");

  const res = await fetch(`${urlBase}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  const body = (await readBody(res)) as Envelope<unknown> | null;

  if (!res.ok || !body?.success) {
    throw errorFrom(res, body);
  }

  return parseOrThrow(schema, body.data, `GET ${path}`);
}

async function apiPostEnveloped<TRequest, TSchema extends z.ZodTypeAny>(
  path: string,
  requestBody: TRequest,
  schema: TSchema
): Promise<z.infer<TSchema>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  const response = (await readBody(res)) as Envelope<unknown> | null;

  if (!res.ok || !response?.success) {
    throw errorFrom(res, response);
  }

  return parseOrThrow(schema, response.data, `POST ${path}`);
}

async function proxyGet<T extends z.ZodTypeAny>(
  path: string,
  schema: T
): Promise<z.infer<T>> {
  const res = await fetch(path, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const body = await readBody(res);

  if (!res.ok) {
    throw errorFrom(res, body);
  }

  const payload =
    body !== null && typeof body === "object" && "data" in (body as object)
      ? (body as { data: unknown }).data
      : body;

  return parseOrThrow(schema, payload, `GET ${path}`);
}

export const LOGIN_URL = `${BASE_URL}/oauth/google/login`;
export const LOGOUT_URL = `${BASE_URL}/oauth/logout`;

export async function getProfile(): Promise<UserProfile | null> {
  const res = await fetch("/api/profile", {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    return null;
  }

  const body = (await readBody(res)) as Envelope<unknown> | null;

  if (!res.ok || !body?.success) {
    throw errorFrom(res, body);
  }

  return parseOrThrow(userProfileSchema, body.data, "GET /api/profile");
}

export function getProblem(problemId: string, apiBaseUrl?: string): Promise<ProblemDetail> {
  return apiGetEnveloped(`/api/problems/${problemId}`, problemDetailSchema, apiBaseUrl);
}

export function getWeeks(): Promise<Week[]> {
  return proxyGet("/api/weeks", weekListSchema);
}

export async function getWeek(id: string): Promise<Week | null> {
  try {
    const weeks = await getWeeks();
    return weeks.find((w) => w.id === id) || null;
  } catch {
    return null;
  }
}

export function getWeekProblems(id: string): Promise<WeekProblem[]> {
  return proxyGet(`/api/weeks/${id}/problems`, weekProblemListSchema);
}

export function getEvents(): Promise<Event[]> {
  return apiGetEnveloped("/api/events", eventListSchema);
}

export function getEvent(id: string): Promise<Event> {
  return apiGetEnveloped(`/api/events/${id}`, eventSchema);
}

export function runCode(problemId: string, body: RunRequest): Promise<RunResponse> {
  return apiPostEnveloped(
    `/api/problems/${problemId}/run`,
    body,
    z.custom<RunResponse>()
  );
}

export function getRun(runId: string): Promise<RunResult> {
  return apiGetEnveloped(`/api/runs/${runId}`, z.custom<RunResult>());
}

export function submitCode(problemId: string, body: SubmitRequest): Promise<SubmitResponse> {
  return apiPostEnveloped(`/api/problems/${problemId}/submit`, body, submitResponseSchema);
}

export function getSubmission(submissionId: string): Promise<SubmissionDetail> {
  return apiGetEnveloped(`/api/submissions/${submissionId}`, submissionDetailSchema);
}

export function getSubmissionHistory(problemId: string): Promise<ProblemSubmission[]> {
  return apiGetEnveloped(`/api/problems/${problemId}/submissions`, problemSubmissionListSchema);
}

function buildLeaderboardEndpoint(kind: LeaderboardKind, tab: LeaderboardTab) {
  const audience = tab === "TSEC" ? "tsec_student" : "other";

  return `/${audience}/${kind}_leaderboard`;
}

export function getLeaderboard(
  kind: "weekly",
  role: UserRole | undefined,
  tab: LeaderboardTab,
  opts: { page: number; limit: number; weekId?: string }
): Promise<WeeklyLeaderboardResponse>;
export function getLeaderboard(
  kind: "season",
  role: UserRole | undefined,
  tab: LeaderboardTab,
  opts: { page: number; limit: number; weekId?: string }
): Promise<SeasonLeaderboardResponse>;
export function getLeaderboard(
  kind: LeaderboardKind,
  role: UserRole | undefined,
  tab: LeaderboardTab,
  opts: { page: number; limit: number; weekId?: string }
): Promise<WeeklyLeaderboardResponse | SeasonLeaderboardResponse>;
export async function getLeaderboard(
  kind: LeaderboardKind,
  role: UserRole | undefined,
  tab: LeaderboardTab,
  opts: { page: number; limit: number; weekId?: string }
): Promise<WeeklyLeaderboardResponse | SeasonLeaderboardResponse> {
  const params = new URLSearchParams();
  params.set("page", String(opts.page));
  params.set("limit", String(opts.limit));
  if (kind === "weekly" && opts.weekId) params.set("week_id", opts.weekId);

  const endpoint = buildLeaderboardEndpoint(kind, tab);
  const path = `/api/leaderboard${endpoint}?${params.toString()}`;

  const res = await fetch(path, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const body = await readBody(res);

  if (!res.ok) {
    throw errorFrom(res, body);
  }

  const schema =
    kind === "weekly" ? weeklyLeaderboardResponseSchema : seasonLeaderboardResponseSchema;

  return parseOrThrow(schema, body, `GET ${path}`);
}

export { ApiError };

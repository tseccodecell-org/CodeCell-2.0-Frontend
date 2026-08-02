import { ProblemDetail } from "./types/problem";
import type{ SubmitRequest,RunRequest,RunResponse,RunResult,SubmitResponse,SubmissionResult,} from "./types/submission";
import {
  LeaderboardKind,
  LeaderboardTab,
  UserRole,
  WeeklyLeaderboardResponse,
  SeasonLeaderboardResponse,
} from "./types/leaderboard";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Week {
  id: string;
  week_number: number;
  chapter_name: string; // display title
  theme?: string;
  description?: string;
  starts_at: string; // ISO datetime
  ends_at: string;
  is_active: boolean;
  scoring_system: "FULL" | "PARTIAL";
  contest_type: "OPEN" | "FIXED";
  created_at: string;
  updated_at: string;
}
 
// Backend model: Problem
export interface Problem {
  id: string;
  week_id?: string;
  event_id?: string;
  title: string;
  slug: string;
  statement: string;
  input_format?: string;
  output_format?: string;
  constraints?: string;
  base_points: number;
  time_limit_ms: number;
  memory_limit_mb: number;
  difficulty: string;
  checker_type: string;
  editorial?: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WeekProblem {
  id: string;
  week_id: string;
  title: string;
  slug: string;
  difficulty: string;
  base_points: number;
  time_limit_ms: number;
  memory_limit_mb: number;
  solved: boolean;
  week_ended: boolean;
}


// Backend DTO: EventResponse (camelCase — distinct from the raw Event model)
export type EventStatus = "UPCOMING" | "LIVE" | "ENDED";
 
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO datetime
  endTime: string;
  status: EventStatus;
}

// ---------- Profile ----------

export interface ProfileWarning {
  id: string;
  stage: number;
  reason: string;
  created_at: string;
}

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  rating: number;
  total_problems_solved: number;
  college_name: string;
  year: string;
  course: string;
  location: string;
  is_tsec_user: boolean;
  is_registered: boolean;
  is_banned: boolean;
  ban_reason: string;
  banned_at: string | null;
  warning_count: number;
  warnings: ProfileWarning[];
}

// The HttpOnly cookie is the only credential. There used to be a localStorage
// Bearer fallback here, which meant a browser could hold two identities at
// once: submits authenticated as the cookie's user while reads authenticated
// as whoever a stale stored token belonged to, and submissions quietly landed
// on another account.
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

  const body = (await readBody(res)) as Envelope<UserProfile> | null;

  if (!res.ok || !body?.success) {
    throw errorFrom(res, body);
  }

  return body.data as UserProfile;
}

export const LOGIN_URL = `${BASE_URL}/oauth/google/login`;
export const LOGOUT_URL = `${BASE_URL}/oauth/logout`;

// ---------- Problems ----------

export function getProblem(
  problemId: string,
  apiBaseUrl?: string
): Promise<ProblemDetail> {
  return apiGetEnveloped<ProblemDetail>(
    `/api/problems/${problemId}`,
    apiBaseUrl
  );
}







 
// ---------- Shared fetch helper ----------

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

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const body = await readBody(res);

  if (!res.ok) {
    throw errorFrom(res, body);
  }

  return body as T;
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

async function apiGetEnveloped<T>(path: string, baseUrl?: string): Promise<T> {
  const urlBase = baseUrl ?? BASE_URL;
  if (!urlBase) throw new ApiError(0, "API base URL is not set");
  const res = await fetch(`${urlBase}${path}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
    credentials: "include",
  });

  const body = (await readBody(res)) as Envelope<T> | null;

  if (!res.ok || !body?.success) {
    throw errorFrom(res, body);
  }

  return body.data as T;
}

async function apiPostEnveloped<TRequest, TResponse>(path: string, requestBody: TRequest): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  const response = (await readBody(res)) as Envelope<TResponse> | null;

  if (!res.ok || !response?.success) {
    throw errorFrom(res, response);
  }

  return response.data as TResponse;
}

export async function getWeeks(): Promise<Week[]> {
  const res = await fetch("/api/weeks", {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw errorFrom(res, await readBody(res));
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function getWeek(id: string): Promise<Week | null> {
  try {
    const weeks = await getWeeks();
    return weeks.find((w) => w.id === id) || null;
  } catch {
    return null;
  }
}
 
export async function getWeekProblems(id: string): Promise<WeekProblem[]> {
  const res = await fetch(`/api/weeks/${id}/problems`, {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw errorFrom(res, await readBody(res));
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data?.data ?? []);
}
 
// ---------- Events ----------
 
export function getEvents(): Promise<Event[]> {
  return apiGetEnveloped<Event[]>("/api/events");
}
 
export function getEvent(id: string): Promise<Event> {
  return apiGetEnveloped<Event>(`/api/events/${id}`);
}

export function runCode(
    problemId: string,
    body: RunRequest
): Promise<RunResponse> {
    return apiPostEnveloped(
        `/api/problems/${problemId}/run`,
        body
    );
}

export function getRun(
    runId: string
): Promise<RunResult> {
    return apiGetEnveloped(
        `/api/runs/${runId}`
    );
}

export function submitCode(
    problemId: string,
    body: SubmitRequest
): Promise<SubmitResponse> {
    return apiPostEnveloped(
        `/api/problems/${problemId}/submit`,
        body
    );
}

export function getSubmission(
    submissionId: string
): Promise<SubmissionResult> {
    return apiGetEnveloped(
        `/api/submissions/${submissionId}`
    );
}

export function getSubmissionHistory(
  problemId: string
): Promise<SubmissionResult[]> {
  return apiGetEnveloped(`/api/problems/${problemId}/submissions`);
}

function buildLeaderboardEndpoint(kind: LeaderboardKind, tab: LeaderboardTab) {
  const audience = tab === "TSEC" ? "tsec_student" : "other";

  return `/${audience}/${kind}_leaderboard`;
}

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
  const headers: Record<string, string> = { Accept: "application/json" };

  // Route through the Next.js API proxy to avoid CORS issues
  const res = await fetch(`/api/leaderboard${endpoint}?${params.toString()}`, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const body = await readBody(res);

  if (!res.ok) {
    throw errorFrom(res, body);
  }

  return body as WeeklyLeaderboardResponse | SeasonLeaderboardResponse;
}


export { ApiError };
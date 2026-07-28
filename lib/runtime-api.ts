export const RUNTIME_BASE_URL =
  process.env.NEXT_PUBLIC_RUNTIME_URL || "http://127.0.0.1:4321";

export type LanguageKey = "cpp" | "c" | "python" | "java";

export interface RunPayload {
  language: LanguageKey;
  source: string;
  stdin: string;
  time_limit_ms?: number;
}

export interface RunResponse {
  verdict:
    | "ACCEPTED"
    | "COMPILE_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR"
    | "SYSTEM_ERROR";
  stdout: string;
  stderr: string;
  compile_time_ms: number;
  execution_time_ms: number;
  exit_code: number;
  error?: string;
  // Metadata indicating where the code was executed
  executionLocation?: "local" | "cloud";
}

export interface ToolchainInfo {
  available: boolean;
  source: "appdata" | "bundled" | "system" | "missing";
  executablePath: string;
}

export interface HealthResponse {
  status: string;
  version: string;
}

/**
 * Checks if local runtime daemon is active at GET /health
 */
export async function checkRuntimeHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const res = await fetch(`${RUNTIME_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return false;
    const data: HealthResponse = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

/**
 * Fetches status of all language toolchains from local daemon
 */
export async function getLocalToolchainStatus(): Promise<Record<
  LanguageKey,
  ToolchainInfo
> | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${RUNTIME_BASE_URL}/api/status`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Executes code directly on local runtime at POST /run
 */
export async function executeLocalCode(
  payload: RunPayload
): Promise<RunResponse> {
  const res = await fetch(`${RUNTIME_BASE_URL}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Local runtime returned HTTP ${res.status}: ${errText}`);
  }

  const data: RunResponse = await res.json();
  return { ...data, executionLocation: "local" };
}

/**
 * Fallback execution on remote server endpoint at POST /api/run
 */
export async function executeCloudCode(
  payload: RunPayload
): Promise<RunResponse> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloud server returned HTTP ${res.status}: ${errText}`);
  }

  const data: RunResponse = await res.json();
  return { ...data, executionLocation: "cloud" };
}

/**
 * Smart execution orchestrator:
 * 1. Checks if local daemon is running.
 * 2. Checks if local toolchain for target language exists (bundled or system).
 * 3. Runs locally if available; otherwise falls back seamlessly to /api/run.
 */
export async function runCode(payload: RunPayload): Promise<RunResponse> {
  // Check local daemon status
  const isHealthy = await checkRuntimeHealth();

  if (isHealthy) {
    const toolchains = await getLocalToolchainStatus();
    const langInfo = toolchains?.[payload.language];

    // If compiler exists locally (bundled, appdata, or system)
    if (langInfo && langInfo.available) {
      try {
        return await executeLocalCode(payload);
      } catch (err) {
        console.warn(
          "Local execution failed unexpectedly. Falling back to cloud runner:",
          err
        );
      }
    }
  }

  // Fallback to cloud backend if daemon offline or compiler missing locally
  return await executeCloudCode(payload);
}
export type SubmissionStatus =
  | "IDLE"
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export type Language =
  | "CPP"
  | "JAVA"
  | "PYTHON";

export interface RunRequest {
  language: Language;
  sourceCode: string;
  stdin?: string;
}

export interface RunResponse {
  testResults: never[];
  errorMessage: string | undefined;
  stderr: string | undefined;
  stdout: string | undefined;
  memoryUsedKb: number | undefined;
  executionTimeMs: number | undefined;
  score: number | undefined;
  verdict: string | undefined;
  runId: string;
  status: string;
}

export interface RunResult {
  id: string;
  status: string;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
}

export interface SubmitRequest {
  language: Language;
  sourceCode: string;
}

export interface SubmissionTestResult {
  passed: unknown;
  testCaseId: string;
  orderNum: number;
  verdict: string;
  timeMs?: number;
  memoryKb?: number;
}

export interface SubmitResponse {
  submissionId: string;
  status: SubmissionStatus;
  queuePosition?: number;
}

export interface SubmissionState {
  status: SubmissionStatus;
  verdict?: string;
  executionTime?: number;
  compileTime?: number;
  memoryUsed?: number;
  score?: number;
  stdout?: string;
  stderr?: string;
  submissionId?: string;
  errorMessage?: string;
  queuePosition?: number;          // new
  testResults: SubmissionTestResult[];
}

// used by history list — optional so existing single-submission usage is unaffected
export interface SubmissionResult {
  id: string;
  status: SubmissionStatus;
  verdict: string;
  score: number;
  executionTimeMs: number;
  memoryUsedKb: number;
  errorMessage?: string;
  testResults: SubmissionTestResult[];
  submittedAt?: string;
  judgedAt?: string;
  language?: Language;
  sourceCode?: string;
}
export type {
  SubmissionStatus,
  SubmissionTestResult,
  SubmitResponse,
  SubmissionDetail,
  ProblemSubmission,
} from "@/lib/schemas/submission";

import type {
  SubmissionStatus,
  SubmissionTestResult,
} from "@/lib/schemas/submission";

export type Language = "CPP" | "JAVA" | "PYTHON";

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
  queuePosition?: number;
  testResults: SubmissionTestResult[];
}

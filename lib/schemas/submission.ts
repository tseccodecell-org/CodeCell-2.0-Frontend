import { z } from "zod";

export const submissionStatusSchema = z.enum([
  "IDLE",
  "PENDING",
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
]);

export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;

const TERMINAL_STATUSES: readonly SubmissionStatus[] = ["COMPLETED", "FAILED"];
const BUSY_STATUSES: readonly SubmissionStatus[] = ["PENDING", "QUEUED", "RUNNING"];

export function toSubmissionStatus(value: string): SubmissionStatus {
  const parsed = submissionStatusSchema.safeParse(value.toUpperCase());
  return parsed.success ? parsed.data : "RUNNING";
}

export function isTerminalStatus(value: string): boolean {
  return TERMINAL_STATUSES.includes(toSubmissionStatus(value));
}

export function isBusyStatus(value: string): boolean {
  return BUSY_STATUSES.includes(toSubmissionStatus(value));
}

export const submissionTestResultSchema = z.object({
  testCaseId: z.string(),
  orderNum: z.number().int(),
  verdict: z.string(),
  timeMs: z.number().int().optional(),
  memoryKb: z.number().int().optional(),
});

export const submitResponseSchema = z.object({
  submissionId: z.string(),
  status: z.string(),
  queuePosition: z.number().int().optional(),
});

export const submissionDetailSchema = z.object({
  id: z.string(),
  status: z.string(),
  verdict: z.string(),
  score: z.number(),
  language: z.string(),
  sourceCode: z.string().optional(),
  queuePosition: z.number().int().optional(),
  invalidated: z.boolean(),
  executionTimeMs: z.number().int().optional(),
  memoryUsedKb: z.number().int().optional(),
  submittedAt: z.string(),
  judgedAt: z.string().optional(),
  errorMessage: z.string().optional(),
  testResults: z
    .array(submissionTestResultSchema)
    .nullable()
    .transform((value) => value ?? []),
});

export const problemSubmissionSchema = z.object({
  id: z.string(),
  status: z.string(),
  verdict: z.string(),
  score: z.number(),
  language: z.string(),
  queuePosition: z.number().int().optional(),
  invalidated: z.boolean(),
  submittedAt: z.string(),
});

export const problemSubmissionListSchema = z
  .array(problemSubmissionSchema)
  .nullable()
  .transform((value) => value ?? []);

export type SubmissionTestResult = z.infer<typeof submissionTestResultSchema>;
export type SubmitResponse = z.infer<typeof submitResponseSchema>;
export type SubmissionDetail = z.infer<typeof submissionDetailSchema>;
export type ProblemSubmission = z.infer<typeof problemSubmissionSchema>;

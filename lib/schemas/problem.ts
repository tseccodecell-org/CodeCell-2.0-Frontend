import { z } from "zod";

const nullableArray = <T extends z.ZodTypeAny>(item: T) =>
  z
    .array(item)
    .nullable()
    .transform((value) => value ?? []);

export const problemExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string(),
});

export const problemLanguageConfigSchema = z.object({
  language: z.string(),
  starterCode: z.string(),
});

export const problemDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: z.string(),
  tags: nullableArray(z.string()),
  description: z.string(),
  inputFormat: z.string(),
  outputFormat: z.string(),
  constraints: z.string(),
  maxScore: z.number(),
  timeLimitMs: z.number().int(),
  memoryLimitMb: z.number().int(),
  examples: nullableArray(problemExampleSchema),
  languages: nullableArray(problemLanguageConfigSchema),
  editorial: z.string().optional(),
  weekEnded: z.boolean().optional(),
});

export type ProblemDetail = z.infer<typeof problemDetailSchema>;
export type ProblemExample = z.infer<typeof problemExampleSchema>;
export type ProblemLanguageConfig = z.infer<typeof problemLanguageConfigSchema>;

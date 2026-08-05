import { z } from "zod";

export const weekSchema = z.object({
  id: z.string(),
  week_number: z.number().int(),
  chapter_name: z.string(),
  theme: z.string().optional(),
  description: z.string().optional(),
  starts_at: z.string(),
  ends_at: z.string(),
  is_active: z.boolean(),
  scoring_system: z.enum(["FULL", "PARTIAL"]),
  contest_type: z.enum(["OPEN", "FIXED"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const weekListSchema = z
  .array(weekSchema)
  .nullable()
  .transform((value) => value ?? []);

export const weekProblemSchema = z.object({
  id: z.string(),
  week_id: z.string(),
  title: z.string(),
  slug: z.string(),
  difficulty: z.string(),
  base_points: z.number(),
  time_limit_ms: z.number().int(),
  memory_limit_mb: z.number().int(),
  solved: z.boolean(),
  week_ended: z.boolean(),
});

export const weekProblemListSchema = z
  .array(weekProblemSchema)
  .nullable()
  .transform((value) => value ?? []);

export type Week = z.infer<typeof weekSchema>;
export type WeekProblem = z.infer<typeof weekProblemSchema>;

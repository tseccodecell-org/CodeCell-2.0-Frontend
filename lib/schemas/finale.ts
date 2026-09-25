import { z } from "zod";

export const finaleStateSchema = z.enum(["DRAFT", "LIVE", "PAUSED", "ENDED"]);
export const finaleAccessModeSchema = z.enum(["OPEN", "RESTRICTED"]);

export type FinaleState = z.infer<typeof finaleStateSchema>;
export type FinaleAccessMode = z.infer<typeof finaleAccessModeSchema>;

export const proctorStatusSchema = z.object({
  strikes: z.number().int(),
  strikeLimit: z.number().int(),
  locked: z.boolean(),
  lockReason: z.string().optional(),
});

export type ProctorStatus = z.infer<typeof proctorStatusSchema>;

export const finaleStatusSchema = z.object({
  weekId: z.string(),
  state: finaleStateSchema,
  accessMode: finaleAccessModeSchema,
  remainingSeconds: z.number(),
  scoringActive: z.boolean(),
  liveSince: z.string().optional(),
  templatesLocked: z.boolean().default(false),
  entryOpen: z.boolean().default(false),
  templatesOpen: z.boolean().default(false),
  internshipOpen: z.boolean().default(false),
  scheduledStartAt: z.string().optional(),
  proctor: proctorStatusSchema.optional(),
});

export type FinaleStatusResponse = z.infer<typeof finaleStatusSchema>;

export const templateLanguageSchema = z.enum(["CPP", "JAVA", "PYTHON"]);
export type TemplateLanguage = z.infer<typeof templateLanguageSchema>;

export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  language: templateLanguageSchema,
  sourceCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TemplateResponse = z.infer<typeof templateSchema>;

export const templateListSchema = z
  .array(templateSchema)
  .nullable()
  .transform((value) => value ?? []);

export const finaleBoardEntrySchema = z.object({
  rank: z.number().int(),
  userId: z.number(),
  name: z.string(),
  score: z.number(),
  problemsSolved: z.number().int(),
});

export const finaleBoardSchema = z
  .array(finaleBoardEntrySchema)
  .nullable()
  .transform((value) => value ?? []);

export type FinaleBoardEntry = z.infer<typeof finaleBoardEntrySchema>;

export const finaleStandingsProblemSchema = z.object({
  id: z.string(),
  label: z.string(),
  title: z.string().optional(),
  points: z.number(),
});

export const finaleStandingsCellSchema = z.object({
  problemId: z.string(),
  solved: z.boolean(),
  points: z.number(),
  solvedAtSeconds: z.number().optional(),
  wrongAttempts: z.number().int(),
  pending: z.boolean(),
});

const listOrEmpty = <T extends z.ZodTypeAny>(item: T) =>
  z
    .array(item)
    .nullable()
    .transform((value) => value ?? []);

export const finaleStandingsRowSchema = z.object({
  rank: z.number().int(),
  userId: z.number(),
  name: z.string(),
  username: z.string().default(""),
  score: z.number(),
  solved: z.number().int(),
  penaltySeconds: z.number(),
  cells: listOrEmpty(finaleStandingsCellSchema),
});

export const finaleStandingsSchema = z.object({
  problems: listOrEmpty(finaleStandingsProblemSchema),
  rows: listOrEmpty(finaleStandingsRowSchema),
});

export type FinaleStandingsProblem = z.infer<typeof finaleStandingsProblemSchema>;
export type FinaleStandingsCell = z.infer<typeof finaleStandingsCellSchema>;
export type FinaleStandingsRow = z.infer<typeof finaleStandingsRowSchema>;
export type FinaleStandings = z.infer<typeof finaleStandingsSchema>;

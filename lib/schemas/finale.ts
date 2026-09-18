import { z } from "zod";

export const finaleStateSchema = z.enum(["DRAFT", "LIVE", "PAUSED", "ENDED"]);
export const finaleAccessModeSchema = z.enum(["OPEN", "RESTRICTED"]);

export type FinaleState = z.infer<typeof finaleStateSchema>;
export type FinaleAccessMode = z.infer<typeof finaleAccessModeSchema>;

export const finaleStatusSchema = z.object({
  weekId: z.string(),
  state: finaleStateSchema,
  accessMode: finaleAccessModeSchema,
  remainingSeconds: z.number(),
  scoringActive: z.boolean(),
  liveSince: z.string().optional(),
  templatesLocked: z.boolean().default(false),
  entryOpen: z.boolean().default(false),
  scheduledStartAt: z.string().optional(),
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

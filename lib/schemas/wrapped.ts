import { z } from "zod";

export const wrappedSchema = z.object({
  hasData: z.boolean(),
  totalSubmissions: z.number().default(0),
  accepted: z.number().default(0),
  acceptanceRate: z.number().default(0),
  problemsSolved: z.number().default(0),
  activeDays: z.number().default(0),
  longestStreakDays: z.number().default(0),
  favouriteLanguage: z.string().optional(),
  favouriteLanguageCount: z.number().default(0),
  peakHour: z.number().default(0),
  peakHourCount: z.number().default(0),
  busiestDay: z.string().optional(),
  busiestDayCount: z.number().default(0),
  lateNightSubmissions: z.number().default(0),
  fastestRuntimeMs: z.number().default(0),
  nemesisProblem: z.string().optional(),
  nemesisAttempts: z.number().default(0),
  nemesisSolved: z.boolean().default(false),
  firstSubmission: z.string(),
  lastSubmission: z.string(),
});

export type WrappedResponse = z.infer<typeof wrappedSchema>;

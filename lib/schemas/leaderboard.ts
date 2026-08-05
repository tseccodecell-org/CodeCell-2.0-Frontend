import { z } from "zod";

export const weeklyLeaderboardEntrySchema = z.object({
  rank: z.number().int(),
  user_id: z.string(),
  name: z.string(),
  weekly_score: z.number(),
  problems_solved: z.number().int(),
  penalty_time: z.number().optional(),
  best_time_ms: z.number().optional(),
});

export const weeklyLeaderboardResponseSchema = z.object({
  week_id: z.string(),
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  has_next: z.boolean(),
  data: z.array(weeklyLeaderboardEntrySchema),
});

export const seasonLeaderboardEntrySchema = z.object({
  rank: z.number().int(),
  user_id: z.string(),
  name: z.string(),
  season_xp: z.number(),
  final_rating: z.number(),
});

export const seasonLeaderboardResponseSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  has_next: z.boolean(),
  data: z.array(seasonLeaderboardEntrySchema),
});

export type WeeklyLeaderboardEntry = z.infer<typeof weeklyLeaderboardEntrySchema>;
export type WeeklyLeaderboardResponse = z.infer<typeof weeklyLeaderboardResponseSchema>;
export type SeasonLeaderboardEntry = z.infer<typeof seasonLeaderboardEntrySchema>;
export type SeasonLeaderboardResponse = z.infer<typeof seasonLeaderboardResponseSchema>;

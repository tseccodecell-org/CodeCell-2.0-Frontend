import { z } from "zod";

export const profileWarningSchema = z.object({
  id: z.string(),
  stage: z.number().int(),
  reason: z.string(),
  created_at: z.string(),
});

export const userProfileSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  rating: z.number(),
  total_problems_solved: z.number().int(),
  college_name: z.string(),
  year: z.string(),
  course: z.string(),
  location: z.string(),
  is_tsec_user: z.boolean(),
  is_registered: z.boolean(),
  is_banned: z.boolean(),
  ban_reason: z.string(),
  banned_at: z.string().nullable(),
  warning_count: z.number().int(),
  warnings: z
    .array(profileWarningSchema)
    .nullable()
    .transform((value) => value ?? []),
});

export type ProfileWarning = z.infer<typeof profileWarningSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

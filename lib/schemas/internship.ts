import { z } from "zod";

export const internshipEligibilitySchema = z.object({
  invited: z.boolean(),
});

export type InternshipEligibility = z.infer<typeof internshipEligibilitySchema>;

export const internshipApplicationSchema = z.object({
  id: z.string(),
  userId: z.number(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  college: z.string(),
  branch: z.string(),
  graduationYear: z.number(),
  cgpa: z.string().optional(),
  resumeUrl: z.string(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  rolePreference: z.string().optional(),
  availability: z.string().optional(),
  locationPref: z.string().optional(),
  note: z.string().optional(),
  submittedAt: z.string(),
  updatedAt: z.string(),
});

export type InternshipApplication = z.infer<typeof internshipApplicationSchema>;

export interface InternshipApplicationRequest {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  graduationYear: number;
  cgpa?: string;
  resumeUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  rolePreference?: string;
  availability?: string;
  locationPref?: string;
  note?: string;
}

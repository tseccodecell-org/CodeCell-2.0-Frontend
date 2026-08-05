export enum UserRole {
  TSEC = "TSEC",
  OTHER = "OTHER",
}

export interface AuthUser {
  id: number;
  role: UserRole;
  name: string;
}

export type LeaderboardTab = "TSEC" | "GLOBAL";

export type LeaderboardKind = "weekly" | "season";

export type {
  WeeklyLeaderboardEntry,
  WeeklyLeaderboardResponse,
  SeasonLeaderboardEntry,
  SeasonLeaderboardResponse,
} from "@/lib/schemas/leaderboard";

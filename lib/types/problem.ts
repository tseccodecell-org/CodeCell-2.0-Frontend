export type {
  ProblemDetail,
  ProblemExample,
  ProblemLanguageConfig,
} from "@/lib/schemas/problem";

export type Difficulty = "EASY" | "MEDIUM" | "HARD" | string;

export interface APISuccess<T> {
  success: true;
  data: T;
}

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type APIResponse<T> = APISuccess<T> | APIError;

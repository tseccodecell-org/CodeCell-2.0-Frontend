export type {
  FinaleState,
  FinaleAccessMode,
  FinaleStatusResponse,
  TemplateLanguage,
  TemplateResponse,
} from "@/lib/schemas/finale";

export type { WeekProblem } from "@/lib/schemas/week";

import type { TemplateLanguage } from "@/lib/schemas/finale";

export interface TemplateRequest {
  name: string;
  language: TemplateLanguage;
  sourceCode: string;
}

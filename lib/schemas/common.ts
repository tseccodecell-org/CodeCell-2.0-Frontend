import { z } from "zod";

export class SchemaError extends Error {
  readonly issues: string[];
  readonly endpoint: string;

  constructor(endpoint: string, issues: string[]) {
    super(`Unexpected response shape from ${endpoint}: ${issues.join("; ")}`);
    this.name = "SchemaError";
    this.endpoint = endpoint;
    this.issues = issues;
  }
}

export function parseOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown,
  endpoint: string
): z.infer<T> {
  const result = schema.safeParse(value);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "(root)";
      return `${path}: ${issue.message}`;
    });

    throw new SchemaError(endpoint, issues);
  }

  return result.data;
}

export const envelopeOf = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    data,
  });

export const numeric = z.coerce.number().finite();

export const listOrEnvelopedList = <T extends z.ZodTypeAny>(item: T) =>
  z.union([
    z.array(item),
    z.object({ data: z.array(item) }).transform((body) => body.data),
  ]);

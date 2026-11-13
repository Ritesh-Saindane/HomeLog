import { z } from 'zod';
import { HttpError } from './http-error';

export function parseBody<T extends z.ZodTypeAny>(schema: T, value: unknown): z.output<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new HttpError(400, result.error.issues.map((issue) => issue.message).join(', '));
  }
  return result.data;
}


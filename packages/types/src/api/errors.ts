import { z } from "zod";

export const ErrorCodeSchema = z.enum([
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "INTERNAL_ERROR",
  "RATE_LIMIT_EXCEEDED",
  "BAD_REQUEST",
  "CONFLICT",
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const LocalizedErrorSchema = z.object({
  code: ErrorCodeSchema,
  details: z.record(z.any()).optional(),
  messageKey: z.string(),
  statusCode: z.number(),
});

export type LocalizedError = z.infer<typeof LocalizedErrorSchema>;

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  BAD_REQUEST: "errors.badRequest",
  CONFLICT: "errors.conflict",
  FORBIDDEN: "errors.forbidden",
  INTERNAL_ERROR: "errors.internal",
  NOT_FOUND: "errors.notFound",
  RATE_LIMIT_EXCEEDED: "errors.rateLimit",
  UNAUTHORIZED: "errors.unauthorized",
  VALIDATION_ERROR: "errors.validation",
};

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public messageKey: string = ERROR_MESSAGES[code],
    public details?: Record<string, unknown>,
    public statusCode: number = 500,
  ) {
    super(messageKey);
    this.name = "AppError";
  }

  toJSON(): LocalizedError {
    return {
      code: this.code,
      details: this.details,
      messageKey: this.messageKey,
      statusCode: this.statusCode,
    };
  }
}

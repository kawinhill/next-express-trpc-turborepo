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
  messageKey: z.string(),
  details: z.record(z.any()).optional(),
  statusCode: z.number(),
});

export type LocalizedError = z.infer<typeof LocalizedErrorSchema>;

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR: "errors.validation",
  NOT_FOUND: "errors.notFound",
  UNAUTHORIZED: "errors.unauthorized",
  FORBIDDEN: "errors.forbidden",
  INTERNAL_ERROR: "errors.internal",
  RATE_LIMIT_EXCEEDED: "errors.rateLimit",
  BAD_REQUEST: "errors.badRequest",
  CONFLICT: "errors.conflict",
};

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public messageKey: string = ERROR_MESSAGES[code],
    public details?: Record<string, any>,
    public statusCode: number = 500
  ) {
    super(messageKey);
    this.name = "AppError";
  }

  toJSON(): LocalizedError {
    return {
      code: this.code,
      messageKey: this.messageKey,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

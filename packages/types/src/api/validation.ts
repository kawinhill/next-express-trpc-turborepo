import { z } from "zod";

export const BaseResponseSchema = z.object({
  message: z.string().optional(),
  success: z.boolean(),
  timestamp: z.string(),
});

export const ErrorResponseSchema = BaseResponseSchema.extend({
  error: z.object({
    code: z.string().optional(),
    details: z.any().optional(),
    message: z.string(),
  }),
  success: z.literal(false),
});

export const SuccessResponseSchema = BaseResponseSchema.extend({
  data: z.any().optional(),
  success: z.literal(true),
});

export const GetTestRequestSchema = z.object({
  query: z
    .object({
      message: z.string().optional(),
    })
    .optional(),
});

export const GetTestResponseSchema = z.object({
  message: z.string(),
});

export const HealthCheckResponseSchema = z.object({
  status: z.literal("healthy"),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string().optional(),
});

export type BaseResponse = z.infer<typeof BaseResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type GetTestRequest = z.infer<typeof GetTestRequestSchema>;
export type GetTestResponse = z.infer<typeof GetTestResponseSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

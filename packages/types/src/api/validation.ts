import { z } from "zod";

export const BaseResponseSchema = z.object({
  success: z.boolean(),
  timestamp: z.string(),
  message: z.string().optional(),
});

export const ErrorResponseSchema = BaseResponseSchema.extend({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.any().optional(),
  }),
});

export const SuccessResponseSchema = BaseResponseSchema.extend({
  success: z.literal(true),
  data: z.any().optional(),
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
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type GetTestRequest = z.infer<typeof GetTestRequestSchema>;
export type GetTestResponse = z.infer<typeof GetTestResponseSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

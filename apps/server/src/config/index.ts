import { z } from "zod";

// Environment validation schema
const envSchema = z.object({
  API_PREFIX: z.string().default("/api"),
  // API Configuration
  API_VERSION: z.string().default("v1"),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),

  // CORS Configuration
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  HOST: z.string().default("localhost"),

  LOG_FILE: z.coerce.boolean().default(false),
  LOG_FORMAT: z.enum(["json", "simple"]).default("simple"),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3001),

  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

export const config = {
  ...env,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
} as const;

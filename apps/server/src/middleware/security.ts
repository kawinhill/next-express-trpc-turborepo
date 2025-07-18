import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { config } from "../config";

// Rate limiting middleware
export const rateLimiter = rateLimit({
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  max: config.RATE_LIMIT_MAX_REQUESTS, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW_MS / 1000),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  windowMs: config.RATE_LIMIT_WINDOW_MS, // 15 minutes
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API usage
});

// API-specific rate limiter (more restrictive)
export const apiRateLimiter = rateLimit({
  max: 50, // limit each IP to 50 API requests per windowMs
  message: "Too many API requests, please try again later.",
  windowMs: 15 * 60 * 1000, // 15 minutes
});

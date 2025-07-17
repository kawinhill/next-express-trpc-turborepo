import cors from "cors";
import express from "express";

import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { rateLimiter, securityHeaders } from "./middleware/security";
import testRoutes from "./routes/test";
import { trpcHandler } from "./routes/trpc";
import logger from "./utils/logger";

const app = express();

app.use(securityHeaders);
app.use(rateLimiter);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-locale",
      "x-trpc-source",
      "x-requested-with",
    ],
    credentials: config.CORS_CREDENTIALS,
    exposedHeaders: ["x-locale"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, allow localhost on any port
      if (config.isDevelopment) {
        const allowedOrigins = [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001",
        ];

        // Check if origin matches any allowed pattern
        const isAllowed =
          allowedOrigins.includes(origin) ||
          origin.match(/^http:\/\/localhost:\d+$/) ||
          origin.match(/^http:\/\/127\.0\.0\.1:\d+$/);

        if (isAllowed) {
          logger.info(`CORS: Allowing origin ${origin}`);
          return callback(null, true);
        } else {
          logger.warn(`CORS: Rejecting origin ${origin}`);
        }
      }

      // In production, use the configured origin
      if (origin === config.CORS_ORIGIN) {
        logger.info(`CORS: Allowing configured origin ${origin}`);
        return callback(null, true);
      }

      // Reject other origins
      logger.error(`CORS: Blocking origin ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    preflightContinue: false,
  }),
);

app.get("/", (req, res) => {
  res.json({
    cors: {
      credentials: config.CORS_CREDENTIALS,
      origin: config.CORS_ORIGIN,
    },
    environment: config.NODE_ENV,
    headers: {
      origin: req.headers.origin,
      userAgent: req.headers["user-agent"],
    },
    message: "Express API Server",
    timestamp: new Date().toISOString(),
    version: config.API_VERSION,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(`${config.API_PREFIX}/${config.API_VERSION}/test`, testRoutes);
app.use(`/${config.API_VERSION}/trpc`, trpcHandler);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;

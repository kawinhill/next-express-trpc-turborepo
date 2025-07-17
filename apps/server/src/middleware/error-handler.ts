import { AppError, ERROR_MESSAGES, type ErrorCode } from "@monorepo/types";
import { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";

import logger from "../utils/logger";

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super("NOT_FOUND", ERROR_MESSAGES.NOT_FOUND, { message }, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message?: string) {
    super(
      "VALIDATION_ERROR",
      ERROR_MESSAGES.VALIDATION_ERROR,
      { message },
      400,
    );
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error("Error occurred:", {
    message: err.message,
    method: req.method,
    stack: err.stack,
    url: req.url,
  });

  let error = { ...err };
  error.message = err.message;

  if (err instanceof ZodError) {
    const message = err.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    error = new ValidationError(`Validation Error: ${message}`);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.toJSON(),
      success: false,
    });
    return;
  }

  const statusCode = 500;
  const code: ErrorCode = "INTERNAL_ERROR";
  const messageKey = ERROR_MESSAGES[code];

  res.status(statusCode).json({
    error: {
      code,
      messageKey,
      statusCode,
    },
    success: false,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  res.status(404).json({
    error: error.toJSON(),
    success: false,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

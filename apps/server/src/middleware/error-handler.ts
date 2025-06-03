import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, ERROR_MESSAGES, ErrorCode } from "@monorepo/types";
import logger from "../utils/logger";

export class ValidationError extends AppError {
  constructor(message?: string) {
    super(
      "VALIDATION_ERROR",
      ERROR_MESSAGES.VALIDATION_ERROR,
      { message },
      400
    );
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super("NOT_FOUND", ERROR_MESSAGES.NOT_FOUND, { message }, 404);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
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
      success: false,
      error: err.toJSON(),
    });
    return;
  }

  const statusCode = 500;
  const code: ErrorCode = "INTERNAL_ERROR";
  const messageKey = ERROR_MESSAGES[code];

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      messageKey,
      statusCode,
    },
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    error: error.toJSON(),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

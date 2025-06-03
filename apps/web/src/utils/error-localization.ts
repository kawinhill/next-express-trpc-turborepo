import { useLocale } from "../providers/locale-provider";

// Centralized error code mapping
export const ERROR_CODES = {
  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "VALIDATION_ERROR",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  CONNECTION_FAILED: "NETWORK_ERROR",
  TIMEOUT: "NETWORK_ERROR",

  // Server errors
  SERVER_ERROR: "SERVER_ERROR",
  INTERNAL_SERVER_ERROR: "SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVER_ERROR",

  // Authentication/Authorization errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  ACCESS_DENIED: "UNAUTHORIZED",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  RESOURCE_NOT_FOUND: "NOT_FOUND",

  // Rate limiting
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  RATE_LIMITED: "TOO_MANY_REQUESTS",

  // Generic/Unknown errors
  GENERIC_ERROR: "GENERIC_ERROR",
  UNKNOWN_ERROR: "GENERIC_ERROR",
  INTERNAL: "GENERIC_ERROR",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

// Hook for error localization
export function useErrorLocalization() {
  const { t } = useLocale();

  const getLocalizedError = (error: string | Error | unknown): string => {
    let errorMessage: string;

    // Extract error message
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = "UNKNOWN_ERROR";
    }

    // Normalize error message to error code
    const normalizedError = normalizeErrorCode(errorMessage);

    // Get localized message
    const translationKey = `errors.${normalizedError}`;
    const localizedMessage = t(translationKey);

    // If translation not found, return generic error
    if (localizedMessage === translationKey) {
      return t("errors.GENERIC_ERROR");
    }

    return localizedMessage;
  };

  const getErrorType = (error: string | Error | unknown): string => {
    let errorMessage: string;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = "UNKNOWN_ERROR";
    }

    const normalizedError = normalizeErrorCode(errorMessage);
    return t(`errors.types.${normalizedError}`);
  };

  return {
    getLocalizedError,
    getErrorType,
  };
}

// Helper function to normalize error codes
function normalizeErrorCode(errorMessage: string): string {
  const upperError = errorMessage.toUpperCase().trim();

  // Direct mapping if exists
  if (upperError in ERROR_CODES) {
    return ERROR_CODES[upperError as ErrorCode];
  }

  // Pattern matching for common error patterns
  if (upperError.includes("VALIDATION") || upperError.includes("INVALID")) {
    return ERROR_CODES.VALIDATION_ERROR;
  }

  if (upperError.includes("NETWORK") || upperError.includes("CONNECTION")) {
    return ERROR_CODES.NETWORK_ERROR;
  }

  if (upperError.includes("UNAUTHORIZED") || upperError.includes("AUTH")) {
    return ERROR_CODES.UNAUTHORIZED;
  }

  if (upperError.includes("FORBIDDEN") || upperError.includes("ACCESS")) {
    return ERROR_CODES.FORBIDDEN;
  }

  if (upperError.includes("NOT_FOUND") || upperError.includes("404")) {
    return ERROR_CODES.NOT_FOUND;
  }

  if (upperError.includes("TOO_MANY") || upperError.includes("RATE")) {
    return ERROR_CODES.TOO_MANY_REQUESTS;
  }

  if (upperError.includes("SERVER") || upperError.includes("500")) {
    return ERROR_CODES.SERVER_ERROR;
  }

  // Default to generic error
  return ERROR_CODES.GENERIC_ERROR;
}

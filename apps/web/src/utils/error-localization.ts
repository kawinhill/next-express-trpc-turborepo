import { useLocale } from "../providers/locale-provider";

// Centralized error code mapping
export const ERROR_CODES = {
  ACCESS_DENIED: "UNAUTHORIZED",
  CONNECTION_FAILED: "NETWORK_ERROR",

  FORBIDDEN: "FORBIDDEN",
  // Generic/Unknown errors
  GENERIC_ERROR: "GENERIC_ERROR",
  INTERNAL: "GENERIC_ERROR",

  INTERNAL_SERVER_ERROR: "SERVER_ERROR",
  INVALID_INPUT: "VALIDATION_ERROR",
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMITED: "TOO_MANY_REQUESTS",
  RESOURCE_NOT_FOUND: "NOT_FOUND",

  // Server errors
  SERVER_ERROR: "SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVER_ERROR",

  TIMEOUT: "NETWORK_ERROR",
  // Rate limiting
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  // Authentication/Authorization errors
  UNAUTHORIZED: "UNAUTHORIZED",
  UNKNOWN_ERROR: "GENERIC_ERROR",
  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

// Hook for error localization
export function useErrorLocalization() {
  const { t } = useLocale();

  const getLocalizedError = (error: Error | string | unknown): string => {
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

  const getErrorType = (error: Error | string | unknown): string => {
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
    getErrorType,
    getLocalizedError,
  };
}

// Helper function to normalize error codes
function normalizeErrorCode(errorMessage: string): string {
  const upperMessage = errorMessage.toUpperCase();

  // Direct mapping from ERROR_CODES
  for (const [key, value] of Object.entries(ERROR_CODES)) {
    if (upperMessage.includes(key) || upperMessage.includes(value)) {
      return value;
    }
  }

  // Additional patterns
  if (upperMessage.includes("VALIDATION") || upperMessage.includes("INVALID")) {
    return "VALIDATION_ERROR";
  }
  if (upperMessage.includes("NETWORK") || upperMessage.includes("CONNECTION")) {
    return "NETWORK_ERROR";
  }
  if (upperMessage.includes("SERVER") || upperMessage.includes("INTERNAL")) {
    return "SERVER_ERROR";
  }
  if (upperMessage.includes("NOT_FOUND") || upperMessage.includes("404")) {
    return "NOT_FOUND";
  }
  if (upperMessage.includes("UNAUTHORIZED") || upperMessage.includes("401")) {
    return "UNAUTHORIZED";
  }
  if (upperMessage.includes("FORBIDDEN") || upperMessage.includes("403")) {
    return "FORBIDDEN";
  }
  if (upperMessage.includes("TOO_MANY") || upperMessage.includes("RATE")) {
    return "TOO_MANY_REQUESTS";
  }

  return "GENERIC_ERROR";
}

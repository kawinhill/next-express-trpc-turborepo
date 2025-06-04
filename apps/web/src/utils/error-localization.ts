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

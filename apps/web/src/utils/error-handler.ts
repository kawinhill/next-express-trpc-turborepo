// import { useTranslations } from 'next-intl'
import type { LocalizedError } from "@monorepo/types";

import { useErrorLocalization } from "./error-localization";

export function useErrorHandler() {
  const { getLocalizedError } = useErrorLocalization();

  const getErrorMessage = (error: Error | LocalizedError | string): string => {
    if (typeof error === "string") {
      return getLocalizedError(error);
    }

    if (error instanceof Error) {
      return getLocalizedError(error.message);
    }

    if ("messageKey" in error && error.messageKey) {
      return getLocalizedError(error.messageKey);
    }

    return getLocalizedError("Unknown error");
  };

  const handleApiError = (error: unknown): string => {
    if (error && typeof error === "object" && "data" in error) {
      const errorData = error as { data?: { error?: unknown } };
      if (errorData.data?.error) {
        return getErrorMessage(
          errorData.data.error as Error | LocalizedError | string,
        );
      }
    }

    if (error && typeof error === "object" && "message" in error) {
      const errorWithMessage = error as { message: string };
      return getErrorMessage(errorWithMessage.message);
    }

    return getLocalizedError("Network error");
  };

  return {
    getErrorMessage,
    handleApiError,
  };
}

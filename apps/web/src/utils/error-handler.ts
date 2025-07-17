// import { useTranslations } from 'next-intl'
import type { ErrorCode, LocalizedError } from "@monorepo/types";

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

  const handleApiError = (error: any): string => {
    if (error?.data?.error) {
      return getErrorMessage(error.data.error);
    }

    if (error?.message) {
      return getErrorMessage(error.message);
    }

    return getLocalizedError("Network error");
  };

  return {
    getErrorMessage,
    handleApiError,
  };
}

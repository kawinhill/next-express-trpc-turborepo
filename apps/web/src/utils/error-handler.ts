// import { useTranslations } from 'next-intl'
import type { LocalizedError, ErrorCode } from "@monorepo/types";

export function useErrorHandler() {
  // const t = useTranslations('errors')

  const getErrorMessage = (error: LocalizedError | Error | string): string => {
    if (typeof error === "string") {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if ("messageKey" in error && error.messageKey) {
      // return t(error.messageKey.replace('errors.', '') as any) || error.messageKey
      return error.messageKey;
    }

    return "Unknown error";
  };

  const handleApiError = (error: any): string => {
    if (error?.data?.error) {
      return getErrorMessage(error.data.error);
    }

    if (error?.message) {
      return getErrorMessage(error.message);
    }

    return "Network error";
  };

  return {
    getErrorMessage,
    handleApiError,
  };
}

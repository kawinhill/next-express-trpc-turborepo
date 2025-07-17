"use client";

import { useTranslations as useNextIntlTranslations } from "next-intl";

import { useLocale } from "../providers/locale-provider";

// Re-export next-intl utilities with consistent naming
export { useTranslations } from "next-intl";

// Utility function for direct translation access (useful for utilities/services)
export function getTranslation(locale: "en" | "th") {
  return {
    // This would need to be used server-side or with dynamic imports
    async t(key: string, params?: Record<string, number | string>) {
      const messages = (await import(`../messages/${locale}.json`)).default;
      const keys = key.split(".");
      let message: unknown = messages;

      for (const k of keys) {
        if (typeof message === "object" && message !== null) {
          message = (message as Record<string, unknown>)[k];
        }
      }

      if (!message) {
        return key;
      }

      if (params && typeof message === "string") {
        Object.entries(params).forEach(([paramKey, value]) => {
          message = (message as string).replace(`{${paramKey}}`, String(value));
        });
      }

      return String(message);
    },
  };
}

// Custom hook that combines next-intl with our locale provider
export function useI18n() {
  const { locale, setLocale } = useLocale();
  const t = useNextIntlTranslations();

  return {
    locale,
    setLocale,
    t,
    // Legacy API compatibility
    translate: t,
  };
}

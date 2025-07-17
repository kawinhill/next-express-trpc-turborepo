"use client";

import { NextIntlClientProvider, useTranslations } from "next-intl";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Locale = "en" | "th";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, number | string>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
  messages?: Record<string, unknown>;
}

export function LocaleProvider({
  children,
  initialLocale,
  messages,
}: LocaleProviderProps) {
  // Use initialLocale from server if provided, otherwise detect client-side
  const [locale, setLocaleState] = useState<Locale>(() => {
    return initialLocale || getInitialLocale();
  });
  const [_isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only re-detect on client if no initial locale was provided from server
    if (!initialLocale) {
      const clientLocale = getInitialLocale();
      if (clientLocale !== locale) {
        setLocaleState(clientLocale);
      }
    }
    setIsHydrated(true);
  }, [locale, initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);

    // Update localStorage
    try {
      localStorage.setItem("locale", newLocale);
    } catch {
      // localStorage might not be available
    }

    // Set cookie for server-side detection (with longer expiry and proper path)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Reload the page to apply the new locale
    window.location.reload();
  };

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={
        messages as Parameters<typeof NextIntlClientProvider>[0]["messages"]
      }
    >
      <TranslationWrapper locale={locale} setLocale={setLocale}>
        {children}
      </TranslationWrapper>
    </NextIntlClientProvider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

function getInitialLocale(): Locale {
  // Check if we're on the client side
  if (typeof window === "undefined") {
    return "en"; // Default for SSR
  }

  // 1. Check for cookie first (highest priority)
  const cookieMatch = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  if (cookieMatch) {
    const cookieLocale = cookieMatch[1] as Locale;
    if (["en", "th"].includes(cookieLocale)) {
      return cookieLocale;
    }
  }

  // 2. Check localStorage
  try {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && ["en", "th"].includes(savedLocale)) {
      return savedLocale;
    }
  } catch {
    // localStorage might not be available
  }

  // 3. Check browser language
  try {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("th")) {
      return "th";
    }
  } catch {
    // navigator might not be available
  }

  // 4. Default fallback
  return "en";
}

// Translation wrapper component that uses next-intl
function TranslationWrapper({
  children,
  locale,
  setLocale,
}: {
  children: ReactNode;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const translations = useTranslations();

  // Custom translation function that preserves the existing API
  const t = (key: string, params?: Record<string, number | string>) => {
    try {
      // First try direct key access
      if (translations.has(key)) {
        return translations(key, params);
      }

      // Try nested key access
      const keys = key.split(".");
      if (keys.length > 1) {
        const namespace = keys[0];
        const nestedKey = keys.slice(1).join(".");
        if (translations.has(`${namespace}.${nestedKey}`)) {
          return translations(`${namespace}.${nestedKey}`, params);
        }
      }

      // Try to access via raw
      let message = translations.raw("");
      for (const k of keys) {
        if (typeof message === "object" && message !== null) {
          message = (message as Record<string, unknown>)[k];
        }
      }

      if (message && typeof message === "string") {
        // Handle parameter substitution manually
        if (params) {
          Object.entries(params).forEach(([paramKey, value]) => {
            message = (message as string).replace(
              `{${paramKey}}`,
              String(value),
            );
          });
        }
        return message;
      }

      // Fallback: return the key if not found
      return key;
    } catch {
      // Ultimate fallback
      return key;
    }
  };

  const contextValue = {
    locale,
    setLocale,
    t,
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

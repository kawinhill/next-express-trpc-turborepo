"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import enMessages from "../messages/en.json";
import thMessages from "../messages/th.json";

type Locale = "en" | "th";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const messages: Record<Locale, Record<string, any>> = {
  en: enMessages,
  th: thMessages,
};

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
  } catch (error) {
    // localStorage might not be available
  }

  // 3. Check browser language
  try {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("th")) {
      return "th";
    }
  } catch (error) {
    // navigator might not be available
  }

  // 4. Default fallback
  return "en";
}

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({
  children,
  initialLocale,
}: LocaleProviderProps) {
  // Use initialLocale from server if provided, otherwise detect client-side
  const [locale, setLocaleState] = useState<Locale>(() => {
    return initialLocale || getInitialLocale();
  });
  const [isHydrated, setIsHydrated] = useState(false);

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
    } catch (error) {
      // localStorage might not be available
    }

    // Set cookie for server-side detection (with longer expiry and proper path)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    // Navigate through nested object using dot notation
    const keys = key.split(".");
    let message: any = messages[locale];

    for (const k of keys) {
      message = message?.[k];
    }

    // Fallback to English if not found
    if (!message) {
      let fallback: any = messages.en;
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      message = fallback;
    }

    // If still not found, return the key
    if (!message) {
      message = key;
    }

    // Handle parameter substitution
    if (params && typeof message === "string") {
      Object.entries(params).forEach(([paramKey, value]) => {
        message = message.replace(`{${paramKey}}`, String(value));
      });
    }

    return String(message);
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

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const locales = ["en", "th"] as const;
type Locale = (typeof locales)[number];

async function getLocaleFromHeaders(): Promise<Locale> {
  const headersList = await headers();
  const detectedLocale = headersList.get("x-locale") as Locale | null;

  if (detectedLocale && locales.includes(detectedLocale)) {
    return detectedLocale;
  }

  return "en"; // Default fallback
}

export default getRequestConfig(async () => {
  const locale = await getLocaleFromHeaders();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

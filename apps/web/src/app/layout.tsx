import "@monorepo/ui/globals.css";

import type { Metadata } from "next";

import { headers } from "next/headers";

import { LocaleProvider } from "../providers/locale-provider";
import { ThemeProvider } from "../providers/theme-provider";
import { TRPCProvider } from "../providers/trpc-provider";

export const metadata: Metadata = {
  description: "Modern full-stack monorepo with type-safe APIs",
  title: "Next.js + Express + tRPC Turborepo",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the locale detected by middleware from headers
  const headersList = await headers();
  const detectedLocale = headersList.get("x-locale") as "en" | "th" | null;
  const initialLocale =
    detectedLocale && ["en", "th"].includes(detectedLocale)
      ? detectedLocale
      : "en";

  // Load messages for the detected locale
  const messages = (await import(`../messages/${initialLocale}.json`)).default;

  return (
    <html lang={initialLocale}>
      <body>
        <TRPCProvider>
          <LocaleProvider initialLocale={initialLocale} messages={messages}>
            <ThemeProvider attribute="class" enableSystem>
              {children}
            </ThemeProvider>
          </LocaleProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}

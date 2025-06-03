import "@monorepo/ui/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../providers/theme-provider";
import { LocaleProvider } from "../providers/locale-provider";
import { TRPCProvider } from "../providers/trpc-provider";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Next.js + Express + tRPC Turborepo",
  description: "Modern full-stack monorepo with type-safe APIs",
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

  return (
    <html lang={initialLocale}>
      <body>
        <TRPCProvider>
          <LocaleProvider initialLocale={initialLocale}>
            <ThemeProvider attribute="class" enableSystem>
              {children}
            </ThemeProvider>
          </LocaleProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}

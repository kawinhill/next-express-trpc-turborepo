import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  // Skip middleware for public files, API routes, and Next.js internals
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  // Get locale from cookie or detect from headers
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const acceptLanguage = req.headers.get("accept-language");

  let detectedLocale = "en"; // default

  if (cookieLocale && ["en", "th"].includes(cookieLocale)) {
    detectedLocale = cookieLocale;
  } else if (acceptLanguage && typeof acceptLanguage === "string") {
    // Simple language detection from accept-language header
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0]?.trim() ?? "")
      .filter(Boolean);
    for (const lang of languages) {
      if (lang.startsWith("th")) {
        detectedLocale = "th";
        break;
      } else if (lang.startsWith("en")) {
        detectedLocale = "en";
        break;
      }
    }
  }

  // Set the locale header for the app to read
  const response = NextResponse.next();
  response.headers.set("x-locale", detectedLocale);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

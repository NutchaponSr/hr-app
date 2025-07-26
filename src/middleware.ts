import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "th"];
const defaultLocales = "en";

const protectedRoutes = ["/", "/dashboard"];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const sessionCookie = getSessionCookie(req);

  const isSignnedIn = !!sessionCookie;

  // Extract the pathname without locale prefix for route checking
  const pathnameWithoutLocale = nextUrl.pathname.replace(/^\/[a-z]{2}/, "") || "/";
  const isProtectedRoute = protectedRoutes.includes(pathnameWithoutLocale);
  const isAuthRoute = pathnameWithoutLocale.startsWith("/auth");

  const pathnameHasLocale = locales.some((locale) =>
    nextUrl.pathname.startsWith(`/${locale}/`) ||
    nextUrl.pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = defaultLocales;
    return NextResponse.redirect(new URL(`/${locale}${nextUrl.pathname}`, req.url));
  }

  // Extract current locale from pathname
  const currentLocale = nextUrl.pathname.split('/')[1] || defaultLocales;

  if (isProtectedRoute && !isSignnedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(new URL(`/${currentLocale}/auth/sign-in?callbackUrl=${callbackUrl}`, req.url));
  }

  if (isAuthRoute && isSignnedIn) {
    return NextResponse.redirect(new URL(`/${currentLocale}/`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.tsx).*)",
  ],
}
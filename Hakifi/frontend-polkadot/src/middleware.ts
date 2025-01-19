import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { HAKIFI_KEY } from "@/utils/constant";
const cookieName = "i18next";

export function middleware(req: NextRequest) {
	const symbol = req.cookies.get(HAKIFI_KEY.SYMBOL) ?? "BNBUSDT";
	if (
		req.nextUrl.pathname.indexOf("icon") > -1 ||
		req.nextUrl.pathname.indexOf("chrome") > -1
	)
		return NextResponse.next();
	let lng;

	if (req.cookies.has(cookieName))
		lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);

	// Disabled auto detect language
	// if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
	// if (!lng) lng = fallbackLng;

	// Redirect if lang in path is not supported
	// if (
	//   !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
	//   !req.nextUrl.pathname.startsWith('/_next')
	// ) {
	//   return NextResponse.redirect(
	//     new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
	//   );
	// }

	// if (req.headers.has('referer')) {
	//   const refererUrl = new URL(req.headers.get('referer') || '');
	//   const lngInReferer = languages.find((l) =>
	//     refererUrl.pathname.startsWith(`/${l}`)
	//   );
	//   const response = NextResponse.next();
	//   if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
	//   return response;
	// }

	// const _url = `/${req.nextUrl.pathname}${req.nextUrl.search}`;

	if (req.nextUrl.pathname.endsWith("/buy-cover")) {
		return NextResponse.redirect(
			new URL(`${req.nextUrl.pathname}/${symbol}${req.nextUrl.search}`, req.url)
		);
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|assets|favicon.ico|opengraph-image|sitemap.xml|robots.txt|action|sw.js).*)",
	],
};

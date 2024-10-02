import { Role } from '@/constants/type';
import { decodeToken } from '@/lib/utils';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/config';
const guestPaths = ["/vi/guest", "/en/guest"];
const managePaths = ['/vi/manage', '/en/manage']
const privatePaths = [...guestPaths, ...managePaths];
const unAuthPaths = ["/vi/login", "/en/login"]
const loginPaths = ["/vi/login", "/en/login"]
const onlyOwnerPaths = ["/vi/manage/accounts", "/en/manage/accounts"]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const handleI18nRouting = createIntlMiddleware({
        locales,
        defaultLocale
    });
    const response = handleI18nRouting(request);

    const { pathname, searchParams } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;
    // Chưa đăng nhập thì không cho vào private path
    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL(`/${locale}/login`, request.url);
        url.searchParams.set("clearTokens", 'true');
        return NextResponse.redirect(url);
        // response.headers.set('x-middleware-rewrite', url.toString());
        // return response;
    }

    // 2. Trường hợp đã đăng nhập
    if (refreshToken) {
        // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
        if (unAuthPaths.some(path => pathname.startsWith(path))) {
            if (loginPaths.some(path => pathname.startsWith(path)) && searchParams.get("accessToken")) {
                return response;
            }
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
            // response.headers.set('x-middleware-rewrite', new URL("/", request.url).toString());
            // return response;
        }
        // 2.2 Nhưng Access token hết hạn
        if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken) {
            const url = new URL(`/${locale}/refresh-token`, request.url);
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set("redirect", pathname)
            return NextResponse.redirect(url);
            // response.headers.set('x-middleware-rewrite', url.toString());
            // return response;
        }
        // 2.3 Nhưng vào không đúng role, redirect về trang chủ
        const role = decodeToken(refreshToken).role
        // Guest nhưng cố vào route owner 
        const isGuestGoToManagePath = (role === Role.Guest && managePaths.some(path => pathname.startsWith(path)))
        // Owner nhưng cố vào route guest  
        const isOwnerGoToGuestPath = (role !== Role.Guest && guestPaths.some(path => pathname.startsWith(path)))
        // Không phải owner nhưng cố tình vào route của owner
        const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some(path => pathname.startsWith(path))
        if (isGuestGoToManagePath || isOwnerGoToGuestPath || isNotOwnerGoToOwnerPath) {
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
            // response.headers.set('x-middleware-rewrite', new URL("/", request.url).toString());
            // return response;
        }
        return response;
    }
    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/(vi|en)/:path*']
}
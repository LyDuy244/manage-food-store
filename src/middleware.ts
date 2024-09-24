import { Role } from '@/constants/type';
import { decodeToken } from '@/lib/utils';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const guestPaths = ["/guest"];
const managePaths = ['/manage']
const privatePaths = [...guestPaths, ...managePaths];
const unAuthPaths = ["/login"]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Chưa đăng nhập thì không cho vào private path
    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL("/login", request.url);
        url.searchParams.set("clearTokens", 'true');
        return NextResponse.redirect(url);
    }

    // 2. Trường hợp đã đăng nhập
    if (refreshToken) {
        // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
        if (unAuthPaths.some(path => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        // 2.2 Nhưng Access token hết hạn
        if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken) {
            const url = new URL("/refresh-token", request.url);
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set("redirect", pathname)
            return NextResponse.redirect(url);
        }
        // 2.3 Nhưng vào không đúng role, redirect về trang chủ
        const role = decodeToken(refreshToken).role
        // Guest nhưng cố vào route owner 
        const isGuestGoToManagePath = (role === Role.Guest && managePaths.some(path => pathname.startsWith(path)))
        // Owner nhưng cố vào route guest 
        const isOwnerGoToGuestPath = (role !== Role.Guest && guestPaths.some(path => pathname.startsWith(path)))
        if (isGuestGoToManagePath || isOwnerGoToGuestPath) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/manage/:paths*', '/guest/:path*']
}
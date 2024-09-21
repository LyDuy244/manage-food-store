import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ["/manage"];
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

    // Đăng nhập rồi sẽ không cho vào login nữa
    if (unAuthPaths.some(path => pathname.startsWith(path)) && refreshToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Truong hop dang nhap roi nhung accessToken het han
    if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken && refreshToken) {
        const url = new URL("/refresh-token", request.url);
        url.searchParams.set('refreshToken', refreshToken)
        url.searchParams.set("redirect", pathname)
        return NextResponse.redirect(url);
    }


    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/manage/:paths*']
}
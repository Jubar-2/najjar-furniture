import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ApiResponse } from "@/lib/apiResponse";

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthPage = pathname.startsWith("/control-panel/auth");
    const isApiControlPanel = pathname.startsWith("/api/control-panel");
    const isControlPanelPage = pathname.startsWith("/control-panel") && !isAuthPage;

    // If accessing login page while already logged in, redirect to control panel dashboard
    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL("/control-panel", request.url));
        }
        return NextResponse.next();
    }

    // Protect API control-panel routes: return 401 Unauthorized if not logged in
    if (isApiControlPanel) {
        if (!token) {
            return ApiResponse.error("Unauthorized. Authentication required.", 401);
        }
        return NextResponse.next();
    }

    // Protect control-panel admin pages: redirect to login page if not logged in
    if (isControlPanelPage) {
        if (!token) {
            const loginUrl = new URL("/control-panel/auth", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname + search);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/control-panel",
        "/control-panel/:path*",
        "/api/control-panel",
        "/api/control-panel/:path*",
    ],
};

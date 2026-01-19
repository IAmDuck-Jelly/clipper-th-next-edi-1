import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude /admin/login from protection
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get('admin_session');
        const adminPassword = process.env.ADMIN_PASSWORD;

        // If no password set in env, allows access (DEV MODE) or block? 
        // Safer to block or require setup. For now, assume if set, we check.
        if (!adminPassword) {
            console.warn('ADMIN_PASSWORD not set');
        }

        if (!adminSession || adminSession.value !== adminPassword) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};

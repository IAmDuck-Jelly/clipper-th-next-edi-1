import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (password === adminPassword) {
            // Set simple cookie
            (await cookies()).set('admin_session', password, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { message: 'Invalid password' },
            { status: 401 }
        );
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

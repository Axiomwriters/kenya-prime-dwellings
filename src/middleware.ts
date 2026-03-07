
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The paths that are considered public and do not require authentication.
const publicPaths = ['/sign-in', '/sign-up', '/onboarding'];

// The mapping of roles to their allowed dashboard paths.
const rolePaths = {
  AGENT: '/dashboard/agent',
  HOST: '/dashboard/host',
  ADMIN: '/dashboard/admin',
};

export async function middleware(req: NextRequest) {
  const { userId, session } = getAuth(req);
  const { pathname } = req.nextUrl;

  // Allow access to public paths.
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If there's no session, redirect to the sign-in page.
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // If we have a session, we can get the user's details.
  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role as string | null;

  // If the user has no role, redirect them to the onboarding page.
  if (!role) {
    if (pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
    return NextResponse.next();
  }

  // If the user has a role, ensure they are accessing the correct dashboard.
  const allowedPath = rolePaths[role];

  if (allowedPath) {
    // If the user is trying to access a different dashboard, redirect them to their own.
    if (!pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(allowedPath, req.url));
    }
  } else {
    // If the role is unknown, redirect to a generic page or show an error.
    // For now, we'll redirect to the homepage.
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

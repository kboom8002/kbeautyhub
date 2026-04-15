import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

const API_PROTECTED_ROUTES = [
  '/api/v1/admin',
  '/api/v1/governance',
  '/api/v1/launch',
  '/api/v1/factory',
  '/api/v1/trust/people' // newly added
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. API Route Protection
  const isApiProtected = API_PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // 2. UI Route Protection
  const isMasterAdmin = pathname.startsWith('/admin');
  const isBrandAdmin = pathname.startsWith('/brand-admin');
  const isExpertPortal = pathname.startsWith('/expert-portal');

  const needsAuth = isApiProtected || isMasterAdmin || isBrandAdmin || isExpertPortal;
  
  if (!needsAuth) return NextResponse.next();

  // Extract Token from Header or Cookies
  let token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('auth_token')?.value;

  if (!token) {
    if (isApiProtected) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Missing Token' }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  try {
    const authContext = await verifyAuthToken(token);

    // Context Evaluation (RBAC)
    if (isMasterAdmin && !['master', 'governance_admin'].includes(authContext.role)) {
      return NextResponse.redirect(new URL('/login?error=Forbidden', req.url));
    }
    if (isBrandAdmin && authContext.role !== 'brand_admin') {
      return NextResponse.redirect(new URL('/login?error=Forbidden', req.url));
    }
    if (isExpertPortal && authContext.role !== 'expert') {
      return NextResponse.redirect(new URL('/login?error=Forbidden', req.url));
    }

    // Inject Headers into the Request (for backend)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.delete('x-admin-role');
    requestHeaders.delete('x-admin-id');
    requestHeaders.delete('x-tenant-id');
    
    requestHeaders.set('x-admin-role', authContext.role);
    requestHeaders.set('x-admin-id', authContext.admin_id);
    requestHeaders.set('x-tenant-id', authContext.tenant_id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err: any) {
    if (isApiProtected) {
      return NextResponse.json({ error: `UNAUTHORIZED: ${err.message}` }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL('/login?error=SessionExpired', req.url));
    }
  }
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/admin/:path*',
    '/brand-admin/:path*',
    '/expert-portal/:path*'
  ],
};

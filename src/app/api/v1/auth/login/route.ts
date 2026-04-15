import { NextRequest, NextResponse } from 'next/server';
import { signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, requested_role } = await req.json();

    // Development Mock Authentication Bypass
    // Real implementation will query UserAccount and verify password/Supabase auth
    const MOCK_USERS: Record<string, { role: string; tenant_id: string; admin_id: string }> = {
      'master@kbeauty.com': { role: 'master', tenant_id: 'SYSTEM', admin_id: 'master-123' },
      'brand@domain.com': { role: 'brand_admin', tenant_id: 'BRAND-001', admin_id: 'brand-123' },
      'expert@clinic.com': { role: 'expert', tenant_id: 'SYSTEM', admin_id: 'expert-123' }
    };

    const user = MOCK_USERS[email];
    if (!user || password !== 'password123') { // hardcoded test password
      return NextResponse.json({ success: false, error: 'Invalid credentials. Use password123' }, { status: 401 });
    }

    // Role override for testing specific roles with the same account context if needed, but we stick to DB mapping
    const finalRole = user.role;

    // Issue JWT
    const token = await signAuthToken({
      admin_id: user.admin_id,
      role: finalRole,
      tenant_id: user.tenant_id
    });

    const response = NextResponse.json({ success: true, role: finalRole });
    
    // Set HttpOnly cookie for Next.js App Router UI Auth
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

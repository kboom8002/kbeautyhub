import { NextResponse } from 'next/server';
import { signAuthToken, type AuthContext } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body: AuthContext = await req.json();
    
    // In MVP, we just trust the mock payload and issue a signed JWT
    if (!body.admin_id || !body.role || !body.tenant_id) {
      return NextResponse.json({ error: 'Missing Required Payload (admin_id, role, tenant_id)' }, { status: 400 });
    }

    const token = await signAuthToken(body);
    
    return NextResponse.json({ access_token: token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { RollbackToolkit } from '@/domain/launch/rollback';

export async function POST(req: Request) {
  // In a real implementation extracting admin_id from auth header
  const admin_id = req.headers.get('x-admin-id') || 'UNKNOWN_ADMIN';

  try {
    const { brand_id, reason } = await req.json();

    if (!brand_id || !reason) {
      return NextResponse.json({ error: "Missing required fields: brand_id, reason" }, { status: 400 });
    }

    const result = await RollbackToolkit.executeConsultSafeRollback(brand_id, reason, admin_id);

    return NextResponse.json({ success: true, result }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { OverrideManager } from '@/domain/factory/override-manager';

export async function PATCH(req: Request, { params }: { params: Promise<{ object_id: string }> }) {
  try {
    const { object_id } = await params;
    const overrides = await req.json();
    
    // Apply overriding (will throw if touching invariant)
    const updated = OverrideManager.applyOverride(object_id, overrides);

    return NextResponse.json({ success: true, object: updated }, { status: 200 });
  } catch (error: any) {
    if (error.message.includes("FORBIDDEN_OVERRIDE")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ object_id: string }> }) {
  try {
    const { object_id } = await params;
    
    const diff = OverrideManager.getDiff(object_id);

    return NextResponse.json({ success: true, diff }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

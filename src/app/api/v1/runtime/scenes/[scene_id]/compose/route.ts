import { NextResponse } from 'next/server';
import { ObjectBundleComposer } from '@/domain/object-bundle/composer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request, { params }: { params: Promise<{ scene_id: string } >}) {
  const traceId = req.headers.get('x-trace-id') || uuidv4();

  const { scene_id } = await params;

  try {
    if (!scene_id) {
      return NextResponse.json({ error: "Missing scene_id" }, { status: 400, headers: { 'x-trace-id': traceId } });
    }

    const composeResult = await ObjectBundleComposer.compose(scene_id);

    return NextResponse.json(composeResult, { 
      status: 200, 
      headers: { 'x-trace-id': traceId } 
    });

  } catch (error: any) {
    console.error(`[Trace: ${traceId}] Compose Error:`, error);
    
    // Fallback logic on Guardrail blocks e.g. INVALID_BUNDLE_HIGH_RISK_MISSING_BOUNDARY
    if (error.message.includes("MISSING_BOUNDARY")) {
       return NextResponse.json({
         error: "Safety Blocked: High risk scene lacks Boundary routing constraints.",
         scene_id: scene_id,
         fallback_scene_ids: ["QIS-CONSULT-DEFAULT"]
       }, { status: 422, headers: { 'x-trace-id': traceId } });
    }

    return NextResponse.json({ error: "Internal Compose Failure" }, { status: 500, headers: { 'x-trace-id': traceId } });
  }
}

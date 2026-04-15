import { NextResponse } from 'next/server';
import { CanonicalMapper } from '@/domain/runtime/canonical-mapper';
import { SceneResolver } from '@/domain/runtime/scene-resolver';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const traceId = req.headers.get('x-trace-id') || uuidv4();

  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400, headers: { 'x-trace-id': traceId } });
    }

    // 1. Map Query to Canonical Question
    const candidates = await CanonicalMapper.mapQuery(query);

    // 2. Resolve to QIS Scene
    const result = await SceneResolver.resolve(candidates);

    // 3. Return Standardized Schema (scene-resolve.result.schema.json)
    return NextResponse.json(result, { headers: { 'x-trace-id': traceId } });

  } catch (error: any) {
    console.error(`[Trace: ${traceId}] Resolve Error:`, error);
    
    // Instead of completely failing on ambiguious/error matching, surface a fallback.
    return NextResponse.json({
      canonical_question_id: "UNKNOWN",
      scene_id: "QIS-FALLBACK-GENERAL",
      confidence: 0,
      risk_level: "low",
      fallback_scene_ids: ["QIS-BROWSE-ALL"]
    }, { status: 422, headers: { 'x-trace-id': traceId } });
  }
}

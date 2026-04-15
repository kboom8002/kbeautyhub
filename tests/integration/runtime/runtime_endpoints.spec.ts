import { describe, it, expect, beforeAll } from 'vitest';
import { POST as resolvePOST } from '@/app/api/v1/runtime/query-resolve/route';
import { POST as composePOST } from '@/app/api/v1/runtime/scenes/[scene_id]/compose/route';
import { createAdminClient } from '@/lib/supabase';
import { ObjectService } from '@/domain/objects/service';

describe('Runtime API Endpoints & Trace ID', () => {

  beforeAll(async () => {
    const supabase = createAdminClient();
    // Prep Scene CQ
    await supabase.from('canonical_question').upsert([
      { canonical_question_id: 'CQ-FIT-004', vertical_id: 'V-MOCK', family_code: 'TEST', title: '민감 피부 적용 문의', signature: 'SIG-FIT-004', primary_object_type: 'AnswerObject', risk_level: 'high' }
    ]);
    // Prep Scene
    await supabase.from('qis_scene').upsert([
      { scene_id: 'SCENE-TEST-COMP', canonical_question_id: 'CQ-FIT-004', representative_query: 'test HR comp', required_objects: ['AnswerObject'], risk_level: 'low' }
    ]);
    // Prep Object
    await ObjectService.upsert({
      object_id: 'OBJ-TEST-COMP-001', object_type: 'AnswerObject', canonical_question_id: 'CQ-FIT-004',
      title: 'Ans Comp Test', answer_short: 'short', answer_full: 'full', decision_criteria: ['crit']
    });
  });

  it('query-resolve endpoint returns correct schema and preserves trace_id', async () => {
    const req = new Request('http://localhost/api/v1/runtime/query-resolve', {
      method: 'POST',
      headers: { 'x-trace-id': 'trace-resolve-123' },
      body: JSON.stringify({ query: '민감 피부도 이 세럼 써도 되나' })
    });

    const res = await resolvePOST(req);
    const data = await res.json();

    expect(res.headers.get('x-trace-id')).toBe('trace-resolve-123');
    expect(data.canonical_question_id).toBe('CQ-FIT-004');
    expect(data.risk_level).toBe('high');
    expect(data.confidence).toBeGreaterThan(0.8);
  });

  it('scene compose endpoint returns object bundle and preserves trace_id', async () => {
    const req = new Request('http://localhost/api/v1/runtime/scenes/SCENE-TEST-COMP/compose', {
      method: 'POST',
      headers: { 'x-trace-id': 'trace-compose-456' }
    });

    const res = await composePOST(req, { params: Promise.resolve({ scene_id: 'SCENE-TEST-COMP' }) });
    const data = await res.json();

    expect(res.headers.get('x-trace-id')).toBe('trace-compose-456');
    expect(data.scene_id).toBe('SCENE-TEST-COMP');
    expect(data.bundle).toBeDefined();
    expect(data.bundle.AnswerObject).toBeDefined();
    expect(data.bundle.AnswerObject.object_id).toBe('OBJ-TEST-COMP-001');
  });
});

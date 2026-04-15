import { describe, it, expect, beforeAll } from 'vitest';
import { CanonicalMapper } from '@/domain/runtime/canonical-mapper';
import { SceneResolver } from '@/domain/runtime/scene-resolver';
import { createAdminClient } from '@/lib/supabase';

describe('Runtime Core Path - GP01 & GP02', () => {
  beforeAll(async () => {
    const supabase = createAdminClient();
    // Setup CQ for testing
    await supabase.from('canonical_question').upsert([
      { canonical_question_id: 'CQ-FIT-004', vertical_id: 'V-MOCK', family_code: 'TEST', title: '민감 피부 적용 문의', signature: 'SIG-FIT-004', primary_object_type: 'AnswerObject', risk_level: 'high' }
    ]);
  });

  it('maps "민감 피부도 이 세럼 써도 되나" to CQ-FIT-004 via rule-first mapper', async () => {
    const query = "민감 피부도 이 세럼 써도 되나";
    
    const candidates = await CanonicalMapper.mapQuery(query);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].canonical_question_id).toBe('CQ-FIT-004');
    expect(candidates[0].confidence).toBeGreaterThan(0.9);
  });

  it('resolves Scene and supplies fallback for High-Risk ambiguous mapping', async () => {
    // Manually pass a candidate with ambiguity
    const candidates = [{
      canonical_question_id: 'CQ-FIT-004',
      confidence: 0.3, // low confidence
      ambiguity: true
    }];

    const result = await SceneResolver.resolve(candidates);
    
    // Check risk level is detected as high
    expect(result.risk_level).toBe('high');
    
    // Check fallback was triggered
    expect(result.fallback_scene_ids).toBeDefined();
    expect(result.fallback_scene_ids).toContain('QIS-KBS-CONSULT-GATE'); // Fallback logic embedded
  });
});

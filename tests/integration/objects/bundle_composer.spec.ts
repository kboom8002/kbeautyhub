import { describe, it, expect } from 'vitest';
import { ObjectBundleComposer } from '@/domain/object-bundle/composer';
import { createAdminClient } from '@/lib/supabase';

describe('Object Bundle Composer', () => {
  it('throws error if high risk scene lacks BoundaryObject in its bundle', async () => {
    const supabase = createAdminClient();

    // Setup Mock Data
    await supabase.from('canonical_question').upsert([
      { canonical_question_id: 'CQ-MOCK-001', vertical_id: 'V-MOCK', family_code: 'TEST', title: 'Test CQ', signature: 'MOCK-001', primary_object_type: 'AnswerObject', risk_level: 'high' }
    ]);
    
    await supabase.from('qis_scene').upsert([
      { scene_id: 'SCENE-HR-MOCK', canonical_question_id: 'CQ-MOCK-001', representative_query: 'test HR', required_objects: ['AnswerObject', 'BoundaryObject'], risk_level: 'high' }
    ]);

    // Insert ONLY AnswerObject, intentionally emitting BoundaryObject
    await supabase.from('object_master').upsert([
      { object_id: 'OBJ-TEST-ANS-001', object_type: 'AnswerObject', canonical_question_id: 'CQ-MOCK-001', title: 'Answer' }
    ]);

    // Compose should fail
    await expect(ObjectBundleComposer.compose('SCENE-HR-MOCK'))
      .rejects.toThrow("INVALID_BUNDLE_HIGH_RISK_MISSING_BOUNDARY");
  });
});

import { describe, it, expect, beforeAll } from 'vitest';
import { CanonicalQuestionService } from '@/domain/canonical-question';
import { createAdminClient } from '@/lib/supabase';

describe('Canonical Question Domain', () => {
  beforeAll(async () => {
    // Ideally clear table or use isolated schema here
  });

  it('blocks saving a duplicate signature as per DB UNIQUE constraint', async () => {
    const input1 = {
      canonical_question_id: 'CQ-TEST-001',
      vertical_id: 'V-TEST',
      family_code: 'ENTRY',
      title: 'First Question',
      signature: 'signature-ab12',
      primary_object_type: 'AnswerObject'
    };

    const input2 = {
      canonical_question_id: 'CQ-TEST-002', // Different ID
      vertical_id: 'V-TEST',
      family_code: 'ENTRY',
      title: 'Duplicate Signature Question',
      signature: 'signature-ab12', // Same Signature
      primary_object_type: 'AnswerObject'
    };

    // First one succeeds
    await CanonicalQuestionService.upsert(input1);

    // Second one with same signature should fail
    await expect(CanonicalQuestionService.upsert(input2)).rejects.toThrow('CQ_SIGNATURE_DUPLICATE');

    // Clean up
    const supabase = createAdminClient();
    await supabase.from('canonical_question').delete().in('canonical_question_id', ['CQ-TEST-001', 'CQ-TEST-002']);
  });
});

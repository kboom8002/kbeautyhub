import { describe, it, expect } from 'vitest';
import { CanonicalQuestionService } from '@/domain/canonical-question';

describe('CQ High Risk Boundary Check', () => {
  it('blocks high risk CQ creation if BoundaryObject is missing', async () => {
    const invalidHighRiskCq = {
      canonical_question_id: 'CQ-TEST-HR-001',
      vertical_id: 'V-TEST',
      family_code: 'QC-01',
      title: 'High Risk without Boundary',
      signature: 'TEST-HR-001',
      primary_object_type: 'AnswerObject',
      secondary_object_types: ['ProofObject'], // Missing BoundaryObject
      risk_level: 'high',
      status: 'ACTIVE',
    };

    await expect(CanonicalQuestionService.upsert(invalidHighRiskCq as any)).rejects.toThrow();
  });
  
  it('allows high risk CQ creation if BoundaryObject is provided', async () => {
    const validHighRiskCq = {
      canonical_question_id: 'CQ-TEST-HR-002',
      vertical_id: 'V-TEST',
      family_code: 'QC-01',
      title: 'High Risk with Boundary',
      signature: 'TEST-HR-002',
      primary_object_type: 'AnswerObject',
      secondary_object_types: ['ProofObject', 'BoundaryObject'],
      risk_level: 'high',
      status: 'ACTIVE',
    };

    const result = await CanonicalQuestionService.upsert(validHighRiskCq as any);
    expect(result.canonical_question_id).toBe('CQ-TEST-HR-002');
  });
});

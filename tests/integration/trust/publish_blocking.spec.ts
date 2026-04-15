import { describe, it, expect } from 'vitest';
import { PublishOrchestrator } from '@/domain/trust/publish-orchestrator';
import { createAdminClient } from '@/lib/supabase';
import { ObjectService } from '@/domain/objects/service';
import { TrustService } from '@/domain/trust/service';

describe('Publish Orchestrator Policies', () => {
  it('blocks publish with BOUNDARY_REQUIRED if high risk and no boundary', async () => {
    const supabase = createAdminClient();

    // CQ & Answer
    await supabase.from('canonical_question').upsert([
      { canonical_question_id: 'CQ-ORCH-001', vertical_id: 'V-MOCK', family_code: 'TEST', title: 'HR missing bound', signature: 'SIG-ORCH-001', primary_object_type: 'AnswerObject', risk_level: 'high' }
    ]);

    await ObjectService.upsert({
      object_id: 'OBJ-ANS-HR-001', object_type: 'AnswerObject', canonical_question_id: 'CQ-ORCH-001',
      title: 'Ans no boundary', answer_short: 'short', answer_full: 'full', decision_criteria: ['crit'],
      evidence_ids: ['EVD-ORCH-001']
      // Intentionally missing linked_boundary_object_ids
    });

    const result = await PublishOrchestrator.evaluate('OBJ-ANS-HR-001', 'AnswerObject', []);
    expect(result.status).toBe('blocked');
    expect(result.reason_code).toBe('BOUNDARY_REQUIRED');
  });

  it('blocks publish with REVIEW_SCOPE_INVALID if reviewer lacks risk ceiling', async () => {
    const supabase = createAdminClient();

    // CQ & Answer (low risk)
    await supabase.from('canonical_question').upsert([
      { canonical_question_id: 'CQ-ORCH-002', vertical_id: 'V-MOCK', family_code: 'TEST', title: 'HR scope check', signature: 'SIG-ORCH-002', primary_object_type: 'AnswerObject', risk_level: 'high' }
    ]);

    await ObjectService.upsert({
      object_id: 'OBJ-ANS-HR-002', object_type: 'AnswerObject', canonical_question_id: 'CQ-ORCH-002',
      title: 'Ans', answer_short: 'short', answer_full: 'full', decision_criteria: ['crit'],
      linked_boundary_object_ids: ['BND-001'],
      evidence_ids: ['EVD-ORCH-001']
    });

    await TrustService.upsertPerson({ person_id: 'PER-LOW-001', display_name: 'Low Auth', person_type: 'domain_reviewer' });
    await TrustService.upsertScope({
      scope_id: 'SCP-LOW-001', person_id: 'PER-LOW-001', claim_types: ['fit'], risk_ceiling: 'low' // Ceiling is 'low', but object is 'high'
    });

    const result = await PublishOrchestrator.evaluate('OBJ-ANS-HR-002', 'AnswerObject', ['PER-LOW-001']);
    expect(result.status).toBe('blocked');
    expect(result.reason_code).toBe('REVIEW_SCOPE_INVALID');
  });

  it('blocks publish with EVIDENCE_STALE_BLOCKED if only critical evidence is stale', async () => {
    // Evidence setup
    await TrustService.upsertEvidence({
      evidence_id: 'EVD-STALE-001', title: 'Stale EVD', evidence_type: 'test_result', evidence_grade: 'A',
      freshness_policy: { stale_after_days: 10 },
      last_validated_at: '2020-01-01T00:00:00Z' // Very stale
    });

    // CQ & Answer setup
    const supabase = createAdminClient();
    await supabase.from('canonical_question').upsert([
      { canonical_question_id: 'CQ-ORCH-003', vertical_id: 'V-MOCK', family_code: 'TEST', title: 'Stale Evd Test', signature: 'SIG-ORCH-003', primary_object_type: 'AnswerObject', risk_level: 'high' }
    ]);
    
    await ObjectService.upsert({
      object_id: 'OBJ-ANS-HR-003', object_type: 'AnswerObject', canonical_question_id: 'CQ-ORCH-003',
      title: 'Ans Stale', answer_short: 'short', answer_full: 'full', decision_criteria: ['crit'],
      linked_boundary_object_ids: ['BND-001'],
      evidence_ids: ['EVD-STALE-001'] // Uses stale evidence
    });

    await TrustService.upsertPerson({ person_id: 'PER-HIGH-001', display_name: 'High Auth', person_type: 'domain_reviewer' });
    await TrustService.upsertScope({
      scope_id: 'SCP-HIGH-001', person_id: 'PER-HIGH-001', claim_types: ['fit'], risk_ceiling: 'high'
    });

    const result = await PublishOrchestrator.evaluate('OBJ-ANS-HR-003', 'AnswerObject', ['PER-HIGH-001']);
    expect(result.status).toBe('blocked');
    expect(result.reason_code).toBe('EVIDENCE_STALE_BLOCKED');
  });
});

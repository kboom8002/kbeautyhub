import { describe, it, expect } from 'vitest';
import { BadgeEligibilityHelper } from '@/domain/trust/badge-helper';
import { createAdminClient } from '@/lib/supabase';
import { ObjectService } from '@/domain/objects/service';
import { TrustService } from '@/domain/trust/service';

describe('Badge Eligibility Helper', () => {
  it('returns false if reviewer scope is invalid or evidence limitations are missing', async () => {
    const supabase = createAdminClient();

    // 1. Prep Person + Scope
    await TrustService.upsertPerson({ person_id: 'PER-BADGE-001', display_name: 'Dr. Test', person_type: 'domain_reviewer' });
    await TrustService.upsertScope({
      scope_id: 'SCP-BADGE-001', person_id: 'PER-BADGE-001', claim_types: ['fit'], risk_ceiling: 'low' 
    });

    // 2. Prep Object & CQ (High risk)
    await supabase.from('canonical_question').upsert([
      { canonical_question_id: 'CQ-BDG-001', vertical_id: 'V-MOCK', family_code: 'TEST', title: 'Badge Mock', signature: 'SIG-BDG-001', primary_object_type: 'AnswerObject', risk_level: 'high' }
    ]);

    await ObjectService.upsert({
      object_id: 'OBJ-BDG-HR-001', object_type: 'AnswerObject', canonical_question_id: 'CQ-BDG-001',
      title: 'Ans for Badge', answer_short: 'short', answer_full: 'full', decision_criteria: ['crit']
    });

    // Scope ceiling 'low' < Risk 'high' -> False
    let eligible = await BadgeEligibilityHelper.isBadgeEligible('OBJ-BDG-HR-001', 'PER-BADGE-001');
    expect(eligible).toBe(false);

    // 3. Test limitations missing
    await TrustService.upsertScope({
      scope_id: 'SCP-BADGE-002', person_id: 'PER-BADGE-001', claim_types: ['fit'], risk_ceiling: 'high' 
    });

    // Insert ProofObject linked
    await ObjectService.upsert({
      object_id: 'OBJ-BDG-PRF-001', object_type: 'ProofObject', canonical_question_id: 'CQ-BDG-001',
      title: 'Proof for Badge', claim_text: 'claim', evidence_items: [{evidence_id: 'EVD-999'}],
      limitations: [] // THIS MISSING CAUSES FALSE
    });
    
    // Manually link
    await supabase.from("graph_edge").upsert([
      { edge_id: "E-BDG-01", source_node_type: "AnswerObject", source_node_id: 'OBJ-BDG-HR-001', target_node_type: "ProofObject", target_node_id: 'OBJ-BDG-PRF-001', edge_type: "DEPENDS_ON", status: "ACTIVE" }
    ]);

    eligible = await BadgeEligibilityHelper.isBadgeEligible('OBJ-BDG-HR-001', 'PER-BADGE-001');
    expect(eligible).toBe(false);
  });
});

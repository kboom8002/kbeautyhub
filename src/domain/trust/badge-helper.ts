import { createAdminClient } from "@/lib/supabase";
import { ReviewerValidator, StaleEvaluator } from "./evaluators";

export class BadgeEligibilityHelper {
  /**
   * Determines if a 'reviewed' badge can be displayed for a specific object and reviewer.
   * Based on: scope + evidence + limitations rules.
   */
  static async isBadgeEligible(object_id: string, reviewer_id: string, targetClaimType: string = "fit"): Promise<boolean> {
    const supabase = createAdminClient();

    // 1. Check Reviewer Scope Validity
    const { data: scopes } = await supabase.from("review_scope")
      .select("*")
      .eq("person_id", reviewer_id)
      .eq("status", "active");

    if (!scopes || scopes.length === 0) return false;

    // We must find the object's risk level derived from CQ
    const { data: obj } = await supabase.from("object_master").select("canonical_question_id").eq("object_id", object_id).single();
    let riskLevel = "low";
    if (obj && obj.canonical_question_id) {
       const { data: cq } = await supabase.from("canonical_question").select("risk_level").eq("canonical_question_id", obj.canonical_question_id).single();
       if (cq && cq.risk_level) riskLevel = cq.risk_level;
    }

    let validScopeFound = false;
    for (const scope of scopes) {
      if (ReviewerValidator.isValid(scope, riskLevel, targetClaimType)) {
        validScopeFound = true;
        break;
      }
    }
    if (!validScopeFound) return false;

    // 2. Proof Object Validation (Evidence + Limitations)
    // The "reviewed badge" asserts the reviewer signed off on ProofObjects linked to this Object.
    const { data: edges } = await supabase.from("graph_edge")
      .select("target_node_id")
      .eq("source_node_id", object_id)
      .eq("target_node_type", "ProofObject");

    if (!edges || edges.length === 0) return false;

    for (const edge of edges) {
       const { data: proof } = await supabase.from("object_proof").select("*").eq("object_id", edge.target_node_id).single();
       if (!proof) continue;
       
       // Rule: limitations 없는 evidence는 trust block 주 근거로 쓰지 않는다
       if (!proof.limitations || proof.limitations.length === 0) {
           return false; // Cannot award badge if proof has no limitations
       }

       // Ensure evidence is valid
       if (!proof.evidence_items || proof.evidence_items.length === 0) return false;
       for (const ei of proof.evidence_items) {
           const { data: ev } = await supabase.from("evidence_ssot").select("*").eq("evidence_id", ei.evidence_id).single();
           if (ev && StaleEvaluator.isStale(ev)) {
               return false; // Stale evidence invalidates badge
           }
       }
    }

    return true;
  }
}

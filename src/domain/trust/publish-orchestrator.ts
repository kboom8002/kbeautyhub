import { createAdminClient } from "@/lib/supabase";
import { ReviewerValidator, StaleEvaluator } from "./evaluators";
import { ObjectService } from "@/domain/objects/service";

export type PublishResult = {
  status: "approved" | "blocked";
  reason_code?: "BOUNDARY_REQUIRED" | "EVIDENCE_STALE_BLOCKED" | "REVIEW_SCOPE_INVALID" | "EVIDENCE_REQUIRED";
  messages: string[];
};

export class PublishOrchestrator {
  /**
   * Evaluates if an object is ready for publish. Returns the blocked reason if not.
   */
  static async evaluate(object_id: string, object_type: string, requestedReviewerIds: string[] = []): Promise<PublishResult> {
    const supabase = createAdminClient();
    
    // 1. Fetch Object
    const obj = await ObjectService.getById(object_id, object_type);
    if (!obj) throw new Error("Object not found");

    // 2. Determine Risk Level from Canonical Question
    let riskLevel = "low";
    if (obj.canonical_question_id) {
      const { data: cq } = await supabase.from("canonical_question")
        .select("risk_level").eq("canonical_question_id", obj.canonical_question_id).single();
      if (cq && cq.risk_level) riskLevel = cq.risk_level;
    }

    const messages = [];

    // --- RULE: BOUNDARY_REQUIRED ---
    // If high risk, a boundary object must be linked
    if (riskLevel === "high") {
      const hasBoundary = obj.linked_boundary_object_ids && obj.linked_boundary_object_ids.length > 0;
      if (!hasBoundary) {
        return {
          status: "blocked",
          reason_code: "BOUNDARY_REQUIRED",
          messages: ["High-risk objects must have at least one valid BoundaryObject linked."]
        };
      }
    }

    // --- RULE: EVIDENCE_STALE_BLOCKED ---
    // If high risk and relies ONLY on stale critical evidence => Block.
    // Fetch evidences
    const evidenceIds = obj.evidence_ids || [];
    // Also gather evidence from Linked Proof Objects
    if (obj.linked_proof_object_ids && obj.linked_proof_object_ids.length > 0) {
      const { data: proofs } = await supabase.from("object_proof").select("evidence_items").in("object_id", obj.linked_proof_object_ids);
      if (proofs) {
        proofs.forEach(p => {
          if (p.evidence_items) {
           p.evidence_items.forEach((ei: any) => evidenceIds.push(ei.evidence_id));
          }
        });
      }
    }

    if (evidenceIds.length === 0) {
      return { status: "blocked", reason_code: "EVIDENCE_REQUIRED", messages: ["Publishing requires at least one evidence"] };
    }

    const { data: evidences } = await supabase.from("evidence_ssot").select("*").in("evidence_id", evidenceIds);
    let allCriticalStale = false;

    if (evidences && evidences.length > 0) {
      const allStale = evidences.every(ev => StaleEvaluator.isStale(ev));
      // In MVP, we consider all grade A/B evidence for high-risk as critical
      const criticalEvidences = evidences.filter(ev => ev.evidence_grade === "A" || ev.evidence_grade === "B");
      if (criticalEvidences.length > 0 && criticalEvidences.every(ev => StaleEvaluator.isStale(ev))) {
        allCriticalStale = true;
      }
    }

    if (riskLevel === "high" && allCriticalStale) {
      return {
        status: "blocked",
        reason_code: "EVIDENCE_STALE_BLOCKED",
        messages: ["High-risk object cannot publish when all its critical evidences are stale."]
      };
    }

    // --- RULE: REVIEW_SCOPE_INVALID ---
    // Check if the requesting reviewers have sufficient scope
    for (const reviewerId of requestedReviewerIds) {
      const { data: scopes } = await supabase.from("review_scope")
        .select("*")
        .eq("person_id", reviewerId)
        .eq("status", "active");

      let validScopeFound = false;
      if (scopes && scopes.length > 0) {
        // Assume default claim_type for objects is "fit" for AnswerObject MVP evaluation.
        const targetClaimType = "fit"; 
        
        for (const scope of scopes) {
          if (ReviewerValidator.isValid(scope, riskLevel, targetClaimType)) {
            validScopeFound = true;
            break;
          }
        }
      }

      if (!validScopeFound) {
        return {
          status: "blocked",
          reason_code: "REVIEW_SCOPE_INVALID",
          messages: [`Reviewer ${reviewerId} lacks scope to approve a ${riskLevel} risk object.`]
        };
      }
    }

    return {
      status: "approved",
      messages: ["All governance validations passed."]
    };
  }
}

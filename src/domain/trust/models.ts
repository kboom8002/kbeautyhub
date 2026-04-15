import { z } from "zod";

export const PeopleSSoTSchema = z.object({
  person_id: z.string().min(1),
  display_name: z.string().min(1),
  person_type: z.enum([
    "domain_reviewer", "evidence_owner", "approval_owner", 
    "editorial_owner", "governance_admin", "brand_representative", "external_expert"
  ]),
  headline_role: z.string().optional(),
  organization: z.string().optional(),
  credentials_summary: z.string().optional(),
  bio_short: z.string().optional(),
  active_status: z.enum(["active", "inactive"]).default("active"),
  visibility_status: z.enum(["private_internal", "public_summary", "public_profile", "hidden"]).default("public_summary"),
  last_reviewed_at: z.string().optional(),
  availability_status: z.string().default("available"),
  conflict_of_interest_flags: z.any().optional()
});

export const ReviewScopeSchema = z.object({
  scope_id: z.string().min(1),
  person_id: z.string().min(1),
  vertical_id: z.string().optional(),
  topic_tags: z.array(z.string()).optional(),
  claim_types: z.array(z.string()).min(1),
  risk_ceiling: z.enum(["low", "medium", "high"]),
  brand_scope: z.array(z.string()).optional(),
  product_scope: z.array(z.string()).optional(),
  approval_rights: z.array(z.string()).optional(),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
  status: z.enum(["active", "expired", "revoked"]).default("active")
});

export const EvidenceSSoTSchema = z.object({
  evidence_id: z.string().min(1),
  title: z.string().min(1),
  evidence_type: z.enum([
    "ingredient_rationale", "protocol_doc", "test_result", "certification",
    "process_record", "case_summary", "product_spec", "expert_note",
    "policy_doc", "benchmark_compare"
  ]),
  summary: z.string().optional(),
  provenance: z.any().optional(),
  owner_person_id: z.string().optional(),
  owner_team: z.string().optional(),
  validity_window: z.any().optional(),
  freshness_policy: z.object({
    refresh_cycle_days: z.number().int().optional(),
    stale_after_days: z.number().int().optional()
  }).optional(),
  evidence_grade: z.enum(["A", "B", "C", "D"]).optional(),
  confidence_level: z.string().optional(),
  applicable_claim_types: z.array(z.string()).optional(),
  topic_tags: z.array(z.string()).optional(),
  brand_scope: z.array(z.string()).optional(),
  limitations: z.array(z.string()).optional(),
  status: z.enum(["active", "stale", "archived"]).default("active"),
  last_validated_at: z.string().optional()
});

export const ChangeLogSchema = z.object({
  change_log_id: z.string().min(1),
  entity_type: z.string().min(1),
  entity_id: z.string().min(1),
  change_type: z.string().min(1),
  change_reason: z.string().optional(),
  trigger_source: z.string().optional(),
  summary_before: z.any().optional(),
  summary_after: z.any().optional(),
  requested_by: z.string().optional(),
  approved_by: z.string().optional(),
  implemented_by: z.string().optional(),
  effective_at: z.string().optional(),
  visibility: z.enum(["internal_only", "public_summary", "hidden"]).default("internal_only")
});

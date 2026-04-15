import { z } from "zod";

export const ObjectMasterSchema = z.object({
  object_id: z.string().min(1),
  object_type: z.enum(["AnswerObject", "CompareObject", "ProofObject", "BoundaryObject", "ActionObject"]),
  canonical_question_id: z.string().optional(), // From spec
  tenant_scope_type: z.string().optional(),
  tenant_scope_id: z.string().optional(),
  title: z.string().min(1),
  status: z.string().default("draft"),
  review_state: z.string().optional(),
  version: z.number().default(1),
  published_at: z.string().optional().nullable()
});

export const AnswerObjectSubtypeSchema = z.object({
  answer_short: z.string().min(1, "answer_short is required"),
  answer_full: z.string().min(1, "answer_full is required"),
  decision_criteria: z.array(z.any()).min(1, "decision_criteria requires at least 1 item"),
  fit_summary: z.any().optional(),
  reviewer_ids: z.array(z.string()).optional(),
  evidence_ids: z.array(z.string()).optional(),
  next_question_ids: z.array(z.string()).optional(),
});

export const CompareObjectSubtypeSchema = z.object({
  compare_targets: z.array(z.any()).min(1),
  difference_dimensions: z.array(z.any()).min(2, "Must have at least 2 difference dimensions"),
  fit_by_case: z.array(z.any()).optional(),
  trade_offs: z.array(z.any()).optional(),
  recommendation_logic: z.any().optional(),
  reviewer_ids: z.array(z.string()).optional(),
  evidence_ids: z.array(z.string()).optional()
}).transform(data => {
  // If fit_by_case is missing or empty, status should be marked incomplete.
  // We'll pass a flag here to let the service downgrade the master status
  const hasFitByCase = data.fit_by_case && data.fit_by_case.length > 0;
  return { ...data, _fallbackStatus: hasFitByCase ? undefined : "incomplete" };
});

export const ProofObjectSubtypeSchema = z.object({
  claim_text: z.string().min(1),
  claim_scope: z.any().optional(),
  evidence_items: z.array(z.any()).min(1, "At least 1 evidence item required"),
  reviewer_statements: z.array(z.any()).optional(),
  confidence_level: z.string().optional(),
  evidence_grade: z.string().optional(),
  limitations: z.array(z.any()).min(1, "limitations required"),
  updated_reason: z.string().optional()
});

export const BoundaryObjectSubtypeSchema = z.object({
  do_not_misread: z.array(z.any()).optional(),
  caution_cases: z.array(z.any()).optional(),
  incompatible_conditions: z.array(z.any()).optional(),
  expectation_boundaries: z.array(z.any()).optional(),
  escalation_rules: z.array(z.any()).optional(),
  reviewer_ids: z.array(z.string()).optional(),
  evidence_ids: z.array(z.string()).optional()
});

export const ActionObjectSubtypeSchema = z.object({
  action_type: z.string().min(1),
  action_goal: z.string().optional(),
  eligibility_rules: z.array(z.any()).optional(),
  recommended_routes: z.array(z.any()).optional(),
  cta_payload: z.any().optional(),
  attribution_rule: z.string().optional()
});

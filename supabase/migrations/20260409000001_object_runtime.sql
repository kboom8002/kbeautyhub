-- Object Runtime Core Migration

-- Object Master
CREATE TABLE object_master (
  object_id VARCHAR(50) PRIMARY KEY,
  object_type VARCHAR(50) NOT NULL, -- AnswerObject, CompareObject, ProofObject, BoundaryObject, ActionObject
  canonical_question_id VARCHAR(50) REFERENCES canonical_question(canonical_question_id),
  tenant_scope_type VARCHAR(50),
  tenant_scope_id VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, in_review, approved, published, deprecated, archived, incomplete
  review_state VARCHAR(50),
  version INTEGER DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Note: We are reusing graph_edge from Session 01 for Object Links

-- Answer Object Subtype
CREATE TABLE object_answer (
  object_id VARCHAR(50) PRIMARY KEY REFERENCES object_master(object_id) ON DELETE CASCADE,
  answer_short TEXT NOT NULL,
  answer_full TEXT NOT NULL,
  decision_criteria JSONB,
  fit_summary JSONB,
  reviewer_ids JSONB,
  evidence_ids JSONB,
  next_question_ids JSONB
);

-- Compare Object Subtype
CREATE TABLE object_compare (
  object_id VARCHAR(50) PRIMARY KEY REFERENCES object_master(object_id) ON DELETE CASCADE,
  compare_targets JSONB NOT NULL,
  difference_dimensions JSONB NOT NULL,
  fit_by_case JSONB,
  trade_offs JSONB,
  recommendation_logic JSONB,
  reviewer_ids JSONB,
  evidence_ids JSONB
);

-- Proof Object Subtype
CREATE TABLE object_proof (
  object_id VARCHAR(50) PRIMARY KEY REFERENCES object_master(object_id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  claim_scope JSONB,
  evidence_items JSONB NOT NULL,
  reviewer_statements JSONB,
  confidence_level VARCHAR(50),
  evidence_grade VARCHAR(50),
  limitations JSONB NOT NULL,
  updated_reason TEXT
);

-- Boundary Object Subtype
CREATE TABLE object_boundary (
  object_id VARCHAR(50) PRIMARY KEY REFERENCES object_master(object_id) ON DELETE CASCADE,
  do_not_misread JSONB,
  caution_cases JSONB,
  incompatible_conditions JSONB,
  expectation_boundaries JSONB,
  escalation_rules JSONB,
  reviewer_ids JSONB,
  evidence_ids JSONB
);

-- Action Object Subtype
CREATE TABLE object_action (
  object_id VARCHAR(50) PRIMARY KEY REFERENCES object_master(object_id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  action_goal VARCHAR(255),
  eligibility_rules JSONB,
  recommended_routes JSONB,
  cta_payload JSONB,
  attribution_rule VARCHAR(100)
);

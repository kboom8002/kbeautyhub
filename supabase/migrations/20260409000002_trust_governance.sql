-- Session 03 Trust & Governance core schema

CREATE TABLE people_ssot (
  person_id VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  person_type VARCHAR(50) NOT NULL,
  headline_role VARCHAR(100),
  organization VARCHAR(100),
  credentials_summary TEXT,
  bio_short TEXT,
  active_status VARCHAR(20) DEFAULT 'active',
  visibility_status VARCHAR(20) DEFAULT 'public_summary',
  last_reviewed_at TIMESTAMPTZ,
  availability_status VARCHAR(20) DEFAULT 'available',
  conflict_of_interest_flags JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Review Scope can be multiple per person
CREATE TABLE review_scope (
  scope_id VARCHAR(50) PRIMARY KEY,
  person_id VARCHAR(50) REFERENCES people_ssot(person_id) ON DELETE CASCADE,
  vertical_id VARCHAR(50),
  topic_tags JSONB,
  claim_types JSONB,
  risk_ceiling VARCHAR(20), -- low, medium, high
  brand_scope JSONB,
  product_scope JSONB,
  approval_rights JSONB,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE evidence_ssot (
  evidence_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  evidence_type VARCHAR(50) NOT NULL,
  summary TEXT,
  provenance JSONB,
  owner_person_id VARCHAR(50) REFERENCES people_ssot(person_id),
  owner_team VARCHAR(50),
  validity_window JSONB,
  freshness_policy JSONB,
  evidence_grade VARCHAR(20),
  confidence_level VARCHAR(50),
  applicable_claim_types JSONB,
  topic_tags JSONB,
  brand_scope JSONB,
  limitations JSONB,
  status VARCHAR(20) DEFAULT 'active',
  last_validated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE governance_changelog (
  change_log_id VARCHAR(50) PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- object, evidence, person
  entity_id VARCHAR(50) NOT NULL,
  change_type VARCHAR(50) NOT NULL,
  change_reason TEXT,
  trigger_source VARCHAR(100),
  summary_before JSONB,
  summary_after JSONB,
  requested_by VARCHAR(50),
  approved_by VARCHAR(50),
  implemented_by VARCHAR(50),
  effective_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  linked_patch_ticket_id VARCHAR(50),
  linked_retest_run_id VARCHAR(50),
  visibility VARCHAR(20) DEFAULT 'internal_only',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add evidence_items to ProofObject using JSONB if not already implicitly supported by Postgres array type.
-- Already supported in object_proof via JSONB in session 02.

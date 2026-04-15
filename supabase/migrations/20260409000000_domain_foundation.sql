-- Domain Foundation MVP Migrations

-- 1. Question Capital
CREATE TABLE question_capital (
  code VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Canonical Question
CREATE TABLE canonical_question (
  canonical_question_id VARCHAR(50) PRIMARY KEY,
  vertical_id VARCHAR(50) NOT NULL,
  family_code VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  signature VARCHAR(255) NOT NULL UNIQUE,
  primary_object_type VARCHAR(50) NOT NULL,
  secondary_object_types JSONB,
  layer VARCHAR(50),
  priority INTEGER,
  risk_level VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. QIS Scene
CREATE TABLE qis_scene (
  scene_id VARCHAR(50) PRIMARY KEY,
  canonical_question_id VARCHAR(50) REFERENCES canonical_question(canonical_question_id),
  scene_title VARCHAR(255),
  representative_query VARCHAR(255) NOT NULL,
  intent VARCHAR(50),
  scenario VARCHAR(100),
  persona_origin VARCHAR(100),
  decision_stage VARCHAR(50),
  risk_level VARCHAR(20),
  trust_requirement VARCHAR(50),
  required_objects JSONB NOT NULL,
  bundle_id VARCHAR(50),
  surface_targets JSONB,
  primary_success_metric VARCHAR(100),
  nudge_rule TEXT,
  bridge_rule TEXT,
  handoff_rule TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Graph Edge
CREATE TABLE graph_edge (
  edge_id VARCHAR(50) PRIMARY KEY,
  source_node_type VARCHAR(50) NOT NULL,
  source_node_id VARCHAR(50) NOT NULL,
  target_node_type VARCHAR(50) NOT NULL,
  target_node_id VARCHAR(50) NOT NULL,
  edge_type VARCHAR(50) NOT NULL,
  metadata JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent self loop
  CONSTRAINT check_no_self_loop CHECK (source_node_id != target_node_id),
  -- Just to ensure uniqueness per edge if necessary, but edge_id is PK, let's keep it simple.
  CONSTRAINT uq_graph_edge UNIQUE (source_node_type, source_node_id, target_node_type, target_node_id, edge_type)
);

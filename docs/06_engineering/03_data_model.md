# Data Model
Version: v1

---

## 1. 문서 목적

이 문서는 운영 truth 모델과 runtime projection 모델을 정의한다.

---

## 2. Entity Groups

### Question Domain
- QuestionCapitalNode
- CanonicalQuestion
- QISScene
- GraphEdge

### Object Domain
- ObjectMaster
- AnswerObject
- CompareObject
- ProofObject
- BoundaryObject
- ActionObject
- ClaimNode
- ObjectLink

### Trust Domain
- PersonSSoT
- ReviewScope
- EvidenceSSoT
- ChangeLog

### Governance Domain
- ReviewAssignment
- PublishDecision
- PatchTicket
- RetestRun
- StaleFlag

### Measurement Domain
- EventLog
- MRISnapshot
- MRIAlert
- DimensionScore
- RCACase

### Tenant Domain
- Tenant
- Brand
- Product
- TemplateFamily
- TenantOverride

---

## 3. 핵심 관계

QuestionCapitalNode
→ CanonicalQuestion
→ QISScene
→ ObjectMaster

ObjectMaster
→ ClaimNode
→ EvidenceSSoT
→ PersonSSoT
→ Boundary / Proof / Action links

Brand
→ Products
→ Brand-scoped Objects
→ Brand Surfaces

MRIAlert
→ PatchTicket
→ RetestRun

---

## 4. 저장 전략

### Postgres
운영 truth의 source of truth

### JSONB
subtype, extension, flexible contract payload

### Object Storage
evidence attachments, media assets

### Search Index
CQ / Scene / retrieval 지원

### Warehouse
MRI / analytics / RCA 분석

---

## 5. 주요 테이블

### canonical_question
- canonical_question_id
- vertical_id
- family_code
- title
- signature
- primary_object_type
- secondary_object_types
- layer
- priority
- risk_level
- status

### qis_scene
- scene_id
- canonical_question_id
- representative_query
- intent
- scenario
- persona_origin
- decision_stage
- risk_level
- trust_requirement
- bundle_id
- status

### object_master
- object_id
- object_type
- canonical_question_id
- tenant_scope_type
- tenant_scope_id
- title
- status
- review_state
- version
- updated_at
- published_at

### person_ssot
- person_id
- display_name
- person_type
- visibility_status
- active_status
- last_reviewed_at

### evidence_ssot
- evidence_id
- title
- evidence_type
- provenance
- validity_window
- freshness_policy
- evidence_grade
- status
- last_validated_at

### patch_ticket
- patch_ticket_id
- entity_type
- entity_id
- severity
- primary_rca_codes
- suggested_patch_types
- status

---

## 6. projection model

### surface_projection
runtime render용 denormalized payload

필드:
- projection_id
- surface_id
- tenant_id
- scene_id
- canonical_question_id
- variant
- render_payload
- risk_level
- built_at
- cache_key

---

## 7. 운영 규칙

- public truth entity는 physical delete 금지
- stale critical evidence는 high-risk publish를 막을 수 있어야 함
- object publish 시 projection refresh가 필요
- claim에는 proof 또는 limitation이 필요

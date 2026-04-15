# API Map
Version: v1

---

## 1. API 계층

### Runtime Read API
public runtime compose / render

### Admin Write API
CQ / Scene / Object / Trust CRUD

### Governance API
review / publish / patch / retest / stale

### MRI / Ops API
snapshot / alerts / ops board

---

## 2. Runtime APIs

### POST /api/v1/runtime/query-resolve
목적:
- query를 CQ + scene으로 resolve

response:
- canonical_question_id
- scene_id
- confidence
- risk_level
- surface_recommendation
- fallback_scene_ids

### POST /api/v1/runtime/scenes/{scene_id}/compose
목적:
- scene 기준 object bundle 조립

### GET /api/v1/runtime/surfaces/{surface_id}
query params:
- scene_id
- tenant_id
- brand_id
- variant

### GET /api/v1/runtime/brands/{brand_id}/fit/{canonical_question_id}
목적:
- brand fit page payload 제공

### GET /api/v1/runtime/objects/{object_id}/trust-bundle
목적:
- trust block / proof page용 payload 제공

### GET /api/v1/runtime/scenes/{scene_id}/next-questions
목적:
- next question rail 반환

---

## 3. Admin APIs

### Question / CQ / Scene
- POST /api/v1/admin/question-capital/nodes
- POST /api/v1/admin/canonical-questions
- PATCH /api/v1/admin/canonical-questions/{id}
- POST /api/v1/admin/scenes
- PATCH /api/v1/admin/scenes/{id}

### Objects
- POST /api/v1/admin/objects
- GET /api/v1/admin/objects/{id}
- PATCH /api/v1/admin/objects/{id}
- POST /api/v1/admin/objects/{id}/links
- POST /api/v1/admin/objects/{id}/publish

### Trust
- POST /api/v1/admin/people
- PATCH /api/v1/admin/people/{id}
- POST /api/v1/admin/evidence
- PATCH /api/v1/admin/evidence/{id}
- POST /api/v1/admin/objects/{id}/assign-reviewer
- POST /api/v1/admin/objects/{id}/attach-evidence

### Surface
- POST /api/v1/admin/surfaces/contracts
- PATCH /api/v1/admin/surfaces/contracts/{id}
- POST /api/v1/admin/surfaces/preview

### Brand / Factory
- POST /api/v1/admin/brands
- POST /api/v1/admin/brands/{id}/products
- POST /api/v1/admin/factory/templates
- POST /api/v1/admin/factory/instantiate-brand-pack

---

## 4. Governance APIs

### Reviews
- POST /api/v1/governance/reviews/assign
- POST /api/v1/governance/reviews/{id}/submit
- POST /api/v1/governance/reviews/{id}/approve
- POST /api/v1/governance/reviews/{id}/reject

### Patches
- POST /api/v1/governance/patches
- PATCH /api/v1/governance/patches/{id}

### Retests
- POST /api/v1/governance/retests
- PATCH /api/v1/governance/retests/{id}

### Stale / Changelog
- GET /api/v1/governance/changelog/{entity_type}/{entity_id}
- GET /api/v1/governance/stale-flags
- POST /api/v1/governance/stale-scan/run

---

## 5. MRI / Ops APIs

- GET /api/v1/mri/d/{entity_type}/{entity_id}
- GET /api/v1/mri/b/{brand_id}
- GET /api/v1/mri/alerts
- POST /api/v1/mri/rca/suggest
- GET /api/v1/ops/overview
- GET /api/v1/ops/patch-board
- GET /api/v1/ops/retest-board
- GET /api/v1/ops/brand-watchlist

---

## 6. API 규칙

- 모든 response는 trace_id 포함
- runtime API는 low-latency 우선
- governance API는 audit log를 남김
- blocked / stale / warning 상태는 response에서 명시적으로 반환

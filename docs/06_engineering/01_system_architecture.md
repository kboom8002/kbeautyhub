# System Architecture
Version: v1
Status: Active

---

## 1. 시스템 한 줄 정의

이 시스템은 질문 자산을 Canonical Question / QIS / Object / Surface / Trust / MRI로 운영하는 Answer Operating System이며, 이를 바탕으로 Vertical AEO Hub와 Brand Mini B-SSoT를 반복 생산하는 SaaS + Factory 구조다.

---

## 2. 상위 제품 구조

### Core Engine SaaS
- Question System
- Canonicalization
- Scene Registry
- Object Runtime
- Trust Layer
- Surface Projection
- Governance
- Measurement (D-MRI / B-MRI)
- Factory

### Vertical AEO Hub
- common question hub
- niche packs
- expert/evidence layer
- compare/trust/action gateway
- story/media layer

### Brand Mini B-SSoT
- brand truth
- fit / compare / proof / action
- answers subdomain
- buy-or-consult

---

## 3. Bounded Contexts

- QuestionContext
- CanonicalizationContext
- SceneRegistryContext
- ObjectContext
- TrustContext
- SurfaceContext
- GovernanceContext
- MeasurementContext
- CommerceContext
- FactoryContext

---

## 4. Core Runtime Flow

User Query
→ query normalize
→ canonical mapping
→ scene resolve
→ object bundle compose
→ trust bundle compose
→ surface project
→ render payload
→ runtime events

---

## 5. Publish Flow

Draft Object
→ attach evidence
→ assign reviewer
→ scope validation
→ publish orchestration
→ projection refresh
→ changelog
→ baseline measurement

---

## 6. Patch Flow

runtime events
→ MRI snapshot
→ alert
→ RCA suggestion
→ patch ticket
→ fix
→ retest
→ close or reopen

---

## 7. Service Split

### app-core
- question
- canonical
- scene
- object
- surface

### trust-governance
- people
- evidence
- review
- publish
- patch
- retest

### mri-ops
- event ingestion
- D-MRI
- B-MRI
- alerts
- ops boards

### factory-admin
- template family
- instantiate
- overrides
- brand pack generation

---

## 8. MVP 배포 원칙

초기 MVP는 단일 app backend + Postgres + Redis + object storage + queue + analytics sink 구조로 시작할 수 있다.

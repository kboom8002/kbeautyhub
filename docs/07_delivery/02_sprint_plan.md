# Sprint Plan
Version: v1
Cadence: 2 weeks per sprint

---

## 1. 문서 목적

이 문서는 MVP delivery를 sprint 단위로 나눈다.

---

## 2. Sprint 계획

### Sprint 1: Foundation Skeleton
포함:
- Question Capital Registry
- CQ Registry
- Scene Registry
- Object Master skeleton
- migrations/schema baseline

Exit:
- CQ/Scene/Object CRUD 가능
- migration 통과
- seed loader skeleton 준비

### Sprint 2: Runtime Core Path
포함:
- query normalize
- canonical map
- scene resolve
- object bundle compose
- CQ 50 / Scene 20 seed

Exit:
- query → scene compose 동작
- P1 scenes preview 가능

### Sprint 3: Trust Core
포함:
- People SSoT
- Evidence SSoT
- Scope Validator
- Publish Orchestrator
- ChangeLog

Exit:
- reviewer/evidence 연결 가능
- publish blocking 작동
- changelog 생성 가능

### Sprint 4: Runtime Surface MVP
포함:
- Search Entry
- Topic Answer
- Compare
- shared trust/boundary/action blocks

Exit:
- public runtime 핵심 path 동작
- high-risk boundary early placement 동작
- no dead-end rail 동작

### Sprint 5: Admin Authoring MVP
포함:
- Registry Screens
- Object Studio
- Surface Preview Lab
- Trust Center
- Reviews Queue

Exit:
- CQ/Scene/Object/Trust authoring 가능
- surface preview 가능
- review queue 가능

### Sprint 6: MRI & Patch Ops
포함:
- Event Ingestor
- D-MRI
- Alerts
- Patch Board
- Retest Board

Exit:
- alert → patch → retest loop 동작
- D-MRI baseline 생성 가능

### Sprint 7: Brand Mini B-SSoT MVP
포함:
- Brand Workspace
- Brand Start/Fit/Proof/Buy-or-Consult
- Core brand seed pack
- K-Beauty risk pack

Exit:
- 1~2 brand onboarding 가능
- brand fit consult route 검증 완료

### Sprint 8: Release Safety + Controlled Launch
포함:
- feature flags
- release gate checker
- rollback toolkit
- controlled beta launch prep

Exit:
- launch gate report 생성 가능
- rollback path 검증 완료

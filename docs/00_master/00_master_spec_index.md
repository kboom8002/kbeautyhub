# Master Spec Index
Version: v1
Status: Active
Vertical: K-Beauty Skincare
Purpose: Answer Operating System + Vertical AEO Hub + Brand Mini B-SSoT 전체 명세 문서 인덱스

---

## 1. 문서 목적

이 문서는 제품/시스템/운영/개발 명세 전체의 진입점이다.

이 문서를 읽는 사람은 아래를 빠르게 파악해야 한다.

1. 우리가 무엇을 만드는가
2. 왜 이 구조로 만드는가
3. 어떤 문서를 어떤 순서로 읽어야 하는가
4. 구현 시작 시 어떤 문서가 source of truth인가

---

## 2. 제품 한 줄 정의

우리는 브랜드와 버티컬이 AI 검색 시대에 공식 정답을 운영할 수 있도록,
Question-first / Truth-first 기반의 Answer Operating System을 만들고,
시장에는 Vertical AEO Hub 제품으로 먼저 판매한다.

---

## 3. 최상위 제품 구조

- Core Engine SaaS
- Vertical AEO Hub
- Brand Mini B-SSoT
- Observatory & Fix-It Subscription
- Factory / Portfolio Edition

---

## 4. 고정 개념

- Question Capital
- Canonical Question
- QIS
- Answer Object
- Compare / Proof / Boundary / Action Object
- People SSoT
- Evidence SSoT
- D-MRI
- B-MRI
- answers subdomain
- Brand Mini B-SSoT

---

## 5. 문서 읽기 순서

### A. 제품/전략
1. `01_one_page_thesis.md`
2. `02_product_definition.md`

### B. 도메인/질문
1. `/docs/01_domain/01_domain_definition_kbeauty.md`
2. `/docs/01_domain/02_question_capital_map.md`
3. `/docs/01_domain/03_canonical_question_set.md`
4. `/docs/01_domain/04_qis_registry.md`

### C. Truth/Object/Trust
1. `/docs/02_truth_objects/01_truth_model.md`
2. `/docs/02_truth_objects/02_answer_object_spec.md`
3. `/docs/03_trust_governance/01_people_ssot_spec.md`
4. `/docs/03_trust_governance/02_evidence_ssot_spec.md`
5. `/docs/03_trust_governance/04_governance_workflow.md`

### D. Surface/UX
1. `/docs/04_surface_ux/01_surface_contract.md`
2. `/docs/04_surface_ux/04_runtime_screen_spec.md`
3. `/docs/04_surface_ux/05_admin_console_spec.md`

### E. 측정/운영
1. `/docs/05_measurement_ops/01_d_mri_spec.md`
2. `/docs/05_measurement_ops/02_b_mri_spec.md`
3. `/docs/05_measurement_ops/03_rca_taxonomy.md`
4. `/docs/05_measurement_ops/04_patch_ops_board.md`

### F. 엔지니어링
1. `/docs/06_engineering/01_system_architecture.md`
2. `/docs/06_engineering/03_data_model.md`
3. `/docs/06_engineering/04_api_map.md`
4. `/docs/06_engineering/05_worker_boundary.md`
5. `/docs/06_engineering/07_prompt_contracts.md`
6. `/docs/06_engineering/08_json_schema_pack.md`

### G. 딜리버리
1. `/docs/07_delivery/01_backlog_epics_modules.md`
2. `/docs/07_delivery/02_sprint_plan.md`
3. `/docs/07_delivery/03_acceptance_criteria.md`
4. `/docs/07_delivery/04_rollout_release_plan.md`

---

## 6. 구현 시작 시 source of truth

### 제품 정의
- `01_one_page_thesis.md`

### 도메인 정의
- `/docs/01_domain/01_domain_definition_kbeauty.md`

### 질문 체계
- `/docs/01_domain/03_canonical_question_set.md`
- `/docs/01_domain/04_qis_registry.md`

### 런타임 구조
- `/docs/06_engineering/01_system_architecture.md`
- `/docs/06_engineering/04_api_map.md`
- `/docs/06_engineering/05_worker_boundary.md`

### 운영/신뢰 구조
- `/docs/03_trust_governance/04_governance_workflow.md`
- `/docs/05_measurement_ops/01_d_mri_spec.md`

---

## 7. 현재 MVP 기준선

- Vertical: K-Beauty Skincare
- Canonical Questions: 50
- Scenes: 20
- Core Surfaces: Search / Topic Answer / Compare / Routine / Proof / Boundary / Brand Fit / Buy-or-Consult
- Core Runtime: Query Resolve → Scene → Object Bundle → Trust Bundle → Surface
- Governance: Review / Publish / Patch / Retest
- Measurement: D-MRI baseline live

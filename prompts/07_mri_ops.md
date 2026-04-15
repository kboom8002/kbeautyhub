# Session 07 — MRI & Ops

이번 세션의 목적은 runtime events → D-MRI snapshot → alert → patch ticket → retest까지의 운영 루프를 구현하는 것이다.

## In Scope
- runtime event ingestor
- D-MRI aggregator
- alert engine
- patch board backend
- retest board backend
- RCA suggestion stub/rule engine
- ops overview API
- tests

## Out of Scope
- B-MRI full sophistication
- advanced data warehouse integration
- polished ops UI
- factory analytics

## 먼저 읽을 문서
1. `/docs/05_measurement_ops/01_d_mri_spec.md`
2. `/docs/05_measurement_ops/03_rca_taxonomy.md`
3. `/docs/05_measurement_ops/04_patch_ops_board.md`
4. `/docs/05_measurement_ops/05_launch_dashboard_spec.md`
5. `/docs/03_trust_governance/06_patch_retest_spec.md`
6. `/docs/07_delivery/03_acceptance_criteria.md`
7. `/openapi/paths/mri-alerts.yaml`
8. `/schemas/mri/mri-alert.schema.json`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/14_build_mri_ops_prompt.md`
- `/prompts/20_review_patch_prompt.md`
- `/prompts/30_test_generation_prompt.md`

## Required Outputs
1. runtime event ingestion endpoint/service
2. D-MRI aggregation service
3. alert creation logic
4. patch ticket routing logic
5. retest plan/run backend
6. ops overview endpoints
7. tests

## Optional Outputs
- RCA suggestion heuristic layer
- launch dashboard seed stats endpoint

## 핵심 제약
- alert without explicit severity/status를 만들지 마라
- patch close without retest를 허용하지 마라
- high-risk trust/boundary degradation은 일반 UX alert보다 우선 라우팅하라
- event schema invalid payload는 저장하지 말고 reject path를 분리하라

## 필수 테스트
1. runtime event → D-MRI snapshot 생성
2. threshold breach → alert 생성
3. alert → patch ticket 생성
4. patch → retest run 생성
5. retest 없이 patch close 불가

## 구현 지침
- data science 시스템처럼 과하게 만들지 말고 ops 시스템으로 시작하라
- aggregation window와 rule config는 코드 분리하라
- 처음에는 D-MRI 중심으로 구현하고 B-MRI는 최소 hook만 남겨라

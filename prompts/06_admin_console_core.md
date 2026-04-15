# Session 06 — Admin Console Core

이번 세션의 목적은 운영자가 CQ/Scene/Object/Trust를 관리할 수 있는 admin core를 구현하는 것이다.

## In Scope
- registry screens API backing
- Object Studio API backing
- Surface Preview Lab API backing
- Trust Center API backing
- Reviews Queue API backing
- minimal admin UI skeleton if repo already has frontend shell
- role/permission guards for admin routes
- tests

## Out of Scope
- polished UI
- full brand workspace
- MRI dashboards full implementation
- factory console

## 먼저 읽을 문서
1. `/docs/04_surface_ux/05_admin_console_spec.md`
2. `/docs/07_delivery/01_backlog_epics_modules.md`
3. `/docs/07_delivery/03_acceptance_criteria.md`
4. `/docs/06_engineering/04_api_map.md`
5. `/docs/03_trust_governance/04_governance_workflow.md`
6. `/docs/02_truth_objects/07_object_linkage_rules.md`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/13_build_surfaces_prompt.md`
- `/prompts/20_review_patch_prompt.md`
- `/prompts/30_test_generation_prompt.md`

## Required Outputs
1. CQ / Scene / Object / Trust registry APIs
2. Object Studio detail/read-write flows
3. Surface Preview API
4. Reviews Queue API
5. admin permission checks
6. tests

## Optional Outputs
- basic table filters/sorts
- health badge helper DTOs

## 핵심 제약
- admin은 예쁘기보다 운영 상태가 먼저 보여야 한다
- Object Studio는 required link 누락을 상단에서 드러내야 한다
- Reviews Queue는 due/risk/missing requirements를 중심으로 노출해야 한다
- reviewer는 publish 직접 불가
- brand operator는 shared template write 금지

## 필수 테스트
1. reviewer role로 publish approval 불가
2. object studio detail에서 missing boundary/proof state 반환
3. surface preview가 slot visibility/fallback 정보를 반환
4. reviews queue가 missing requirements를 포함

## 구현 지침
- 프론트가 아직 없으면 API와 DTO를 우선 만들라
- admin backing API가 있으면 이후 UI 생성 속도가 빨라진다
- permission matrix를 하드코딩하지 말고 role-based helper로 분리하라

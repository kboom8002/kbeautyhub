# Session 05 — Runtime Surfaces

이번 세션의 목적은 Topic Answer / Compare / Routine / Boundary-Consult 핵심 runtime surface payload와 shared blocks를 구현하는 것이다.

## In Scope
- surface projector
- Topic Answer surface
- Compare surface
- Routine Guide surface
- Boundary/Consult surface
- shared blocks: trust / boundary / action / next-question
- render payload schema validation
- runtime integration tests

## Out of Scope
- full admin preview UI
- brand surfaces
- MRI dashboards
- factory

## 먼저 읽을 문서
1. `/docs/04_surface_ux/01_surface_contract.md`
2. `/docs/04_surface_ux/02_vertical_hub_ia.md`
3. `/docs/04_surface_ux/04_runtime_screen_spec.md`
4. `/docs/04_surface_ux/06_screen_state_matrix.md`
5. `/docs/02_truth_objects/02_answer_object_spec.md`
6. `/docs/02_truth_objects/03_compare_object_spec.md`
7. `/docs/02_truth_objects/05_boundary_object_spec.md`
8. `/schemas/runtime/surface-render.schema.json`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/13_build_surfaces_prompt.md`
- `/prompts/30_test_generation_prompt.md`
- `/prompts/31_high_risk_safety_test_prompt.md`

## Required Outputs
1. surface projector service
2. topic answer payload builder
3. compare payload builder
4. routine guide payload builder
5. boundary/consult payload builder
6. shared slot utilities
7. tests

## Optional Outputs
- compact vs warning variants
- projection cache stub

## 핵심 제약
- Surface는 truth source가 아니라 projection이어야 한다
- high-risk surface는 boundary early placement를 강제하라
- buy-only payload가 high-risk flow에 노출되면 안 된다
- trust/boundary/action/next-question shared blocks는 독립 재사용 가능해야 한다
- required slot missing 시 fallback/blocked 정책을 명시적으로 반환하라

## 필수 테스트
1. Topic Answer payload가 answer/trust/boundary/next/action 슬롯 포함
2. high-risk path에서 boundary slot visible=true
3. compare surface에서 fit_by_case가 반드시 포함
4. blocked state에서 safer route 또는 consult path 존재
5. surface payload가 JSON schema를 통과

## 구현 지침
- FE 화면 자체보다 먼저 runtime payload contract를 완성하라
- payload가 안정되면 이후 UI는 얹을 수 있게 하라
- render variant는 default/compact/warning/consult_first 중심으로 시작하라

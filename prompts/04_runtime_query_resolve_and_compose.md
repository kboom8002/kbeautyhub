# Session 04 — Runtime Query Resolve & Compose

이번 세션의 목적은 query → canonical question → scene → object bundle까지의 runtime core path를 구현하는 것이다.

## In Scope
- query normalize
- canonical mapping
- scene resolve
- scene compose API
- runtime trace propagation
- safer fallback scene handling
- integration tests

## Out of Scope
- full public page UI
- trust block UI details
- MRI aggregation
- brand pack generation

## 먼저 읽을 문서
1. `/docs/01_domain/03_canonical_question_set.md`
2. `/docs/01_domain/04_qis_registry.md`
3. `/docs/06_engineering/01_system_architecture.md`
4. `/docs/06_engineering/04_api_map.md`
5. `/docs/06_engineering/05_worker_boundary.md`
6. `/docs/04_surface_ux/06_screen_state_matrix.md`
7. `/schemas/runtime/scene-resolve.result.schema.json`
8. `/tests/e2e/golden_paths.md`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/11_build_runtime_prompt.md`
- `/prompts/30_test_generation_prompt.md`
- `/prompts/31_high_risk_safety_test_prompt.md`

## Required Outputs
1. runtime query resolve endpoint
2. canonical mapping service
3. scene resolve service
4. scene compose endpoint
5. trace_id propagation
6. integration/e2e tests

## Optional Outputs
- lexical + seed-based candidate retrieval helper
- lightweight debug payload

## 핵심 제약
- high-risk ambiguity 시 safer fallback scene을 함께 반환하라
- resolve가 실패해도 empty hard fail보다는 safer questions 또는 fallback scene 경로를 남겨라
- scene compose는 object bundle까지만 책임지고 surface render를 직접 하지 마라
- query normalize/canonical map은 deterministic first, heuristic second로 구현하라

## 필수 테스트
1. `"민감 피부도 이 세럼 써도 되나"` → `CQ-FIT-004` 또는 safe equivalent + risk `high`
2. fallback_scene_ids가 high-risk ambiguity에서 반환
3. scene compose가 object bundle을 반환
4. trace_id가 resolve → compose까지 유지

## 구현 지침
- 완전한 LLM resolver를 만들지 마라
- seed와 registry를 이용한 rule-first resolver로 시작하라
- 이후 개선 가능하도록 service boundary만 분리하라

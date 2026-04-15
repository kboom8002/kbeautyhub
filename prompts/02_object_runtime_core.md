# Session 02 — Object Runtime Core

이번 세션의 목적은 object runtime의 핵심 정본 구조와 bundle compose를 구현하는 것이다.

## In Scope
- ObjectMaster + subtype tables
- AnswerObject / CompareObject / ProofObject / BoundaryObject / ActionObject schema
- Object link graph
- Object bundle composer
- object validation
- object seed loading
- 관련 unit/integration tests

## Out of Scope
- trust bundle compose
- publish orchestration
- public surface render
- MRI
- brand-specific workspace

## 먼저 읽을 문서
1. `/docs/02_truth_objects/01_truth_model.md`
2. `/docs/02_truth_objects/02_answer_object_spec.md`
3. `/docs/02_truth_objects/03_compare_object_spec.md`
4. `/docs/02_truth_objects/04_proof_object_spec.md`
5. `/docs/02_truth_objects/05_boundary_object_spec.md`
6. `/docs/02_truth_objects/06_action_object_spec.md`
7. `/docs/02_truth_objects/07_object_linkage_rules.md`
8. `/docs/06_engineering/03_data_model.md`
9. `/docs/08_seeds/04_kbeauty_object_seed.yaml`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/10_build_foundation_prompt.md`
- `/prompts/21_refactor_alignment_prompt.md`
- `/prompts/30_test_generation_prompt.md`

## Required Outputs
1. object master + subtype persistence
2. subtype validators
3. object link service
4. scene → object bundle compose service
5. object seed load path
6. 테스트

## Optional Outputs
- denormalized object read model
- bundle explain/debug payload

## 핵심 제약
- high-risk scene의 bundle compose 결과에 BoundaryObject가 없으면 invalid 처리하라
- ProofObject는 Evidence / Person 연결을 참조할 수 있어야 하지만, trust validation은 이번 세션에서 완성하려고 하지 마라
- CompareObject는 fit_by_case 없으면 incomplete로 취급하라
- ActionObject는 boundary-aware route 구조를 보존해야 한다

## 필수 테스트
1. high-risk scene + boundary 없음 → bundle invalid
2. compare object without fit_by_case → validation fail
3. answer object required field validation
4. object link graph에서 required links 조회 가능

## 구현 지침
- subtype별 required field를 schema-first로 구현하라
- object bundle compose는 “truth selection”까지만 책임지고 trust enrichment는 건드리지 마라
- 각 subtype의 타입/validator를 분리하되, 저장 계층은 지나치게 분산시키지 마라

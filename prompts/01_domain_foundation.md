# Session 01 — Domain Foundation

이번 세션의 목적은 K-Beauty MVP의 질문 체계 기반을 구현하는 것이다.

## In Scope
- Question Capital Registry
- Canonical Question Registry
- QIS Scene Registry
- Graph Edge Registry
- 관련 DB migration / schema / seed wiring
- admin read/write API의 최소 골격
- registry 단위 unit/integration tests

## Out of Scope
- object subtype 상세 구현
- runtime query resolve
- trust/governance
- public runtime surfaces
- MRI / ops
- brand pack

## 먼저 읽을 문서
1. `/docs/00_master/00_master_spec_index.md`
2. `/docs/01_domain/01_domain_definition_kbeauty.md`
3. `/docs/01_domain/02_question_capital_map.md`
4. `/docs/01_domain/03_canonical_question_set.md`
5. `/docs/01_domain/04_qis_registry.md`
6. `/docs/06_engineering/01_system_architecture.md`
7. `/docs/06_engineering/03_data_model.md`
8. `/docs/07_delivery/01_backlog_epics_modules.md`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/10_build_foundation_prompt.md`
- `/prompts/30_test_generation_prompt.md`

## Required Outputs
1. Question Capital / Canonical Question / QIS Scene / Graph Edge의 persistence layer
2. 관련 migration 파일
3. 최소 admin CRUD/registry API
4. seed loader가 CQ/scene seed를 읽을 수 있는 구조
5. 기본 테스트

## Optional Outputs
- registry list filtering
- simple admin DTO mapper
- enum/constants package

## 핵심 제약
- canonical question signature uniqueness를 보장하라
- QIS scene은 representative query / risk / required_objects / surface_targets를 보존해야 한다
- graph edge는 invalid self-loop를 기본 차단하라
- soft delete 대신 status lifecycle을 우선 사용하라

## 필수 테스트
1. CQ 중복 signature 저장 차단
2. scene 생성 시 required_objects 저장 검증
3. graph edge self-loop invalid case 검증
4. seed apply 후 CQ와 scene 조회 가능

## 구현 지침
- DB schema와 domain types를 먼저 만든다
- 그다음 repository / service / API 순으로 간다
- admin screen까지는 만들지 말고, 화면에 필요한 API contract만 최소 제공하라
- 파일 수를 과도하게 늘리지 말고 domain package 경계를 명확히 유지하라

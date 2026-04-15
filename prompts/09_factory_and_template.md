# Session 09 — Factory & Template

이번 세션의 목적은 vertical shared structure를 brand pack으로 반복 생산할 수 있게 template/factory 계층을 구현하는 것이다.

## In Scope
- template family registry
- template instantiate flow
- brand pack generator (draft only)
- override manager
- override diff/read model
- tests

## Out of Scope
- public launch of generated brand packs without review
- portfolio-wide analytics sophistication
- automated publish

## 먼저 읽을 문서
1. `/docs/06_engineering/01_system_architecture.md`
2. `/docs/07_delivery/01_backlog_epics_modules.md`
3. `/docs/04_surface_ux/03_brand_mini_bssot_ia.md`
4. `/docs/02_truth_objects/07_object_linkage_rules.md`
5. `/docs/05_measurement_ops/02_b_mri_spec.md`
6. `/docs/08_seeds/01_seed_strategy.md`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/15_build_brand_pack_prompt.md`
- `/prompts/21_refactor_alignment_prompt.md`
- `/prompts/30_test_generation_prompt.md`

## Required Outputs
1. template family model/service
2. instantiate template flow
3. brand pack generator
4. override storage and diff
5. tests

## Optional Outputs
- reuse ratio helper
- starter pack validation report

## 핵심 제약
- generated brand pack은 반드시 draft 상태여야 한다
- shared invariants를 override가 침범하면 warning 또는 block을 반환하라
- factory는 새로운 truth system이 아니라 existing shared contracts의 반복 생산 계층이어야 한다

## 필수 테스트
1. instantiate 결과로 starter brand pack draft 생성
2. override diff 조회 가능
3. forbidden override on shared invariant 차단
4. generated pack auto-publish 금지

## 구현 지침
- factory는 content generation보다 structure replication에 집중하라
- override는 자유도가 아니라 governance 대상이라는 관점으로 구현하라

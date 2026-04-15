# Session 08 — Brand Mini B-SSoT

이번 세션의 목적은 브랜드 단위의 Start / Fit / Proof / Buy-or-Consult core를 구현하는 것이다.

## In Scope
- brand workspace backend
- brand truth profile
- brand-scoped object retrieval
- Brand Start payload
- Brand Fit payload
- Brand Proof payload
- Buy-or-Consult payload
- brand readiness score
- tests

## Out of Scope
- factory template instantiation
- advanced media/story layer
- portfolio analytics

## 먼저 읽을 문서
1. `/docs/04_surface_ux/03_brand_mini_bssot_ia.md`
2. `/docs/04_surface_ux/04_runtime_screen_spec.md`
3. `/docs/07_delivery/01_backlog_epics_modules.md`
4. `/docs/07_delivery/03_acceptance_criteria.md`
5. `/docs/05_measurement_ops/02_b_mri_spec.md`
6. `/docs/08_seeds/04_kbeauty_object_seed.yaml`
7. `/docs/08_seeds/05_kbeauty_risk_policy_seed.yaml`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/15_build_brand_pack_prompt.md`
- `/prompts/31_high_risk_safety_test_prompt.md`
- `/prompts/30_test_generation_prompt.md`

## Required Outputs
1. brand truth/profile model and service
2. brand workspace backend
3. Brand Start / Fit / Proof / Buy-or-Consult runtime payloads
4. readiness score calculator
5. tests

## Optional Outputs
- brand top questions helper
- brand handoff analytics hook

## 핵심 제약
- who-its-for와 who-its-not-for를 모두 다뤄야 한다
- brand fit claim은 proof 없이 과장되면 안 된다
- medium/high risk brand flow에서 consult route가 없어서는 안 된다
- Brand Start는 marketing hero가 아니라 question entry-first여야 한다

## 필수 테스트
1. brand fit payload에 who-its-for / who-its-not-for 동시 존재
2. brand proof payload에 reviewer scope / evidence summary 포함
3. medium/high risk buy-or-consult에 consult route 존재
4. readiness score 계산 가능

## 구현 지침
- brand는 vertical shared structure를 reuse해야 한다
- brand 전용 구조를 새로 만드는 대신 shared contract + brand scope override로 구현하라

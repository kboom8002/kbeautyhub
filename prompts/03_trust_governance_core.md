# Session 03 — Trust & Governance Core

이번 세션의 목적은 People/Evidence/Review Scope/Publish Blocking의 핵심 trust layer를 구현하는 것이다.

## In Scope
- People SSoT
- Review Scope
- Evidence SSoT
- Reviewer Scope Validator
- Publish Orchestrator
- ChangeLog Generator
- stale freshness basic scan
- trust-related tests

## Out of Scope
- full patch/retest loop
- MRI aggregation
- public proof page render
- brand-specific trust workspace UI

## 먼저 읽을 문서
1. `/docs/03_trust_governance/01_people_ssot_spec.md`
2. `/docs/03_trust_governance/02_evidence_ssot_spec.md`
3. `/docs/03_trust_governance/03_review_scope_spec.md`
4. `/docs/03_trust_governance/04_governance_workflow.md`
5. `/docs/03_trust_governance/05_changelog_spec.md`
6. `/docs/02_truth_objects/07_object_linkage_rules.md`
7. `/docs/04_surface_ux/06_screen_state_matrix.md`
8. `/docs/08_seeds/05_kbeauty_risk_policy_seed.yaml`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/12_build_trust_governance_prompt.md`
- `/prompts/30_test_generation_prompt.md`
- `/prompts/31_high_risk_safety_test_prompt.md`

## Required Outputs
1. person / review_scope / evidence persistence and service layer
2. reviewer scope validation logic
3. publish orchestration with blocking reason codes
4. changelog generation hook
5. stale evidence basic evaluator
6. 테스트

## Optional Outputs
- trust bundle preliminary assembler
- badge eligibility helper

## 핵심 제약
- reviewed badge eligibility는 반드시 scope + evidence + limitations 기준을 따른다
- high-risk publish에서 boundary missing이면 blocked
- stale critical evidence만 연결된 high-risk object는 blocked
- reviewer scope mismatch는 explicit reason code로 반환하라
- changelog는 public summary와 internal detail 분리 가능해야 한다

## 필수 테스트
1. high-risk object publish + boundary missing → `BOUNDARY_REQUIRED`
2. stale critical evidence only + high-risk → `EVIDENCE_STALE_BLOCKED`
3. scope mismatch → `REVIEW_SCOPE_INVALID`
4. reviewed badge 조건 불충족 시 badge helper false

## 구현 지침
- publish orchestration은 “최종 승인 UX”가 아니라 “정책 판정 엔진”으로 구현하라
- trust를 surface에 뿌리는 것보다 먼저 trust validity를 정형화하라
- stale logic은 과도하게 복잡하게 하지 말고 policy-driven evaluator로 시작하라

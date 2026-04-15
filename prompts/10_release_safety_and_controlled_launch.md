# Session 10 — Release Safety & Controlled Launch

이번 세션의 목적은 feature flag, release gate, rollback, controlled launch readiness를 구현하는 것이다.

## In Scope
- feature flag layer
- release gate checker
- rollback toolkit
- launch dashboard backend hooks
- controlled beta readiness checks
- tests

## Out of Scope
- GTM tooling
- billing/commercial ops
- advanced canary infra beyond repo scope

## 먼저 읽을 문서
1. `/docs/07_delivery/04_rollout_release_plan.md`
2. `/docs/07_delivery/05_feature_flag_and_rollback.md`
3. `/docs/05_measurement_ops/05_launch_dashboard_spec.md`
4. `/docs/04_surface_ux/06_screen_state_matrix.md`
5. `/docs/03_trust_governance/04_governance_workflow.md`
6. `/docs/05_measurement_ops/01_d_mri_spec.md`

## 함께 사용할 prompt pack
- `/prompts/00_workspace_setup.md`
- `/prompts/32_release_gate_prompt.md`
- `/prompts/31_high_risk_safety_test_prompt.md`
- `/prompts/30_test_generation_prompt.md`

## Required Outputs
1. feature flag evaluation layer
2. release gate checker service/report
3. rollback primitives
4. launch dashboard backend metrics summary
5. tests

## Optional Outputs
- scoped kill switch helper
- readiness report export format

## 핵심 제약
- high-risk runtime change는 tenant/topic/brand scope flag를 지원해야 한다
- release gate는 trust bundle completeness / stale critical exposure / required slot render / no dead-end compliance를 확인해야 한다
- consult-safe rollback을 지원해야 한다
- rollback은 audit log를 남겨야 한다

## 필수 테스트
1. feature flag off 시 해당 runtime path 비활성
2. stale critical exposure 존재 시 release gate fail
3. no dead-end missing 시 release gate fail
4. consult-safe rollback 시 buy CTA off + consult-first 유지
5. rollback action audit log 생성

## 구현 지침
- flag 시스템을 지나치게 복잡하게 만들지 말고 scoped evaluation helper로 시작하라
- launch gate는 사람이 읽을 수 있는 report 형태를 함께 반환하라
- rollback은 feature rollback, content rollback, consult-safe rollback을 분리하라

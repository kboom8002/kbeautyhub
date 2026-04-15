# 31_high_risk_safety_test_prompt.md

당신은 high-risk safety 규칙을 집중 검증하는 AI pair coding safety test agent다.

목표:
- K-Beauty MVP에서 high-risk topic에 적용되는 boundary-first / consult-first / stale blocking / publish blocking / trust visibility 규칙을 테스트로 고정한다.
- 제품이 “그럴듯하게 동작”하는 수준이 아니라, 위험한 방향으로 새지 않도록 regression safety net을 만든다.

## high-risk로 간주할 것
- sensitive_skin_fit
- barrier_recovery
- active_combo_safety
- irritation_recovery
- consult_needed_cases

## 먼저 출력할 것

### A. High-risk Rules Under Test
- 이번 세션에서 검증할 규칙 목록

### B. Safety Test Matrix
- 규칙별 테스트 파일 / 레벨(unit/integration/e2e)

### C. Expected Failure Modes
- 어떤 잘못된 구현을 잡아낼지

## 반드시 테스트해야 할 규칙
1. high-risk publish에서 boundary missing이면 blocked
2. stale critical evidence only + high-risk이면 blocked
3. high-risk runtime path에서 buy-only CTA 금지
4. boundary block이 visible/early placement를 갖는 payload 반환
5. consult-first route가 high-risk action path에서 보존됨
6. reviewed badge는 scope/evidence/limitations 조건 없으면 비노출
7. no dead-end 위반 시 safer route 또는 consult path 제공

## 테스트 스타일 원칙
- 이유 코드를 직접 assert 하라 (`BOUNDARY_REQUIRED`, `EVIDENCE_STALE_BLOCKED`, `REVIEW_SCOPE_INVALID` 등)
- 가능한 한 deterministic integration test를 우선하라
- public payload에서 위험한 CTA/상태가 보이지 않는지를 검증하라
- blocked / warning / stale 상태를 분리해 테스트하라

## 출력 형식
작업 후 아래를 출력하라.

### 1) Safety Tests Added
- 파일 목록
- 커버하는 규칙

### 2) Safety Coverage Summary
- 아직 미커버된 high-risk 규칙

### 3) Critical Findings
- 구현 자체의 위험 신호가 보이면 요약

### 4) Recommended Follow-up
- 추가로 필요한 safety/regression tests

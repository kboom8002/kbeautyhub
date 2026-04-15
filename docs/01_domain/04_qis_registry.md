# QIS Registry
Version: v1
Vertical: K-Beauty Skincare

---

## 1. 문서 목적

이 문서는 Canonical Question을 실제 runtime 장면으로 운영하기 위한 Query-Intent-Scenario registry를 정의한다.

---

## 2. QIS Scene 구조

각 Scene은 아래 필드를 가진다.

- scene_id
- canonical_question_id
- scene_title
- representative_query
- intent
- scenario
- persona_origin
- decision_stage
- risk_level
- trust_requirement
- required_objects
- bundle_id
- surface_targets
- primary_success_metric
- nudge_rule
- bridge_rule
- handoff_rule

---

## 3. 샘플 Scene

### QIS-KBS-001
- canonical_question_id: CQ-ENTRY-003
- scene_title: 민감 피부 초보 루틴 진입
- representative_query: 민감 피부 루틴 뭐부터 시작
- intent: discover
- scenario: 초보_입문
- persona_origin: problem_led_novice
- decision_stage: discover
- risk_level: medium
- required_objects: Answer, Boundary, Action
- surface_targets: topic_answer_page, routine_guide

### QIS-KBS-004
- canonical_question_id: CQ-FIT-004
- scene_title: 민감 피부 적합성 판단
- representative_query: 민감 피부도 이 제품 써도 되나
- intent: fit
- scenario: 제품_상세_검토
- persona_origin: risk_sensitive_user
- decision_stage: evaluate
- risk_level: high
- required_objects: Answer, Boundary, Proof
- surface_targets: brand_fit_page, trust_block

### QIS-KBS-010
- canonical_question_id: CQ-ING-006
- scene_title: 성분 병행 사용 안전성 판단
- representative_query: 비타민C 레티놀 같이 써도 되나
- intent: safety
- scenario: 자극_우려
- persona_origin: risk_sensitive_user
- decision_stage: trust_check
- risk_level: high
- required_objects: Boundary, Proof, Answer
- surface_targets: boundary_block, trust_block

### QIS-KBS-020
- canonical_question_id: CQ-ACTION-002
- scene_title: 구매 vs 상담 결정
- representative_query: 지금 바로 사도 돼 아니면 상담 먼저야
- intent: act
- scenario: 상담_전환
- persona_origin: action_ready_user
- decision_stage: act
- risk_level: high
- required_objects: Action, Boundary, Proof
- surface_targets: action_module, consult_gate

---

## 4. Scene Resolve 규칙

- query는 먼저 normalized query로 정규화
- CQ candidate를 찾는다
- risk/persona/scenario를 반영해 최종 scene을 고른다
- ambiguity가 높으면 safer fallback scene을 함께 반환한다

---

## 5. high-risk scene 규칙

high-risk scene은 아래를 강제한다.

- BoundaryObject 필수
- consult-first fallback 가능
- proof/trust visibility 필수
- aggressive action CTA 금지
- safer route 카드 필수

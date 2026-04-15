# ActionObject Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 구매 / 상담 / 루틴 저장 / 브랜드 handoff를 결정하는 ActionObject를 정의한다.

---

## 2. 역할

ActionObject는 사용자의 현재 장면과 risk 수준에 따라 다음 행동을 라우팅한다.

주요 action:
- buy
- consult
- save routine
- sample / trial
- handoff to brand
- handoff to expert

---

## 3. 핵심 필드

- object_id
- canonical_question_id
- title
- action_type
- action_goal
- eligibility_rules
- recommended_routes
- cta_payload
- attribution_rule
- linked_boundary_object_ids
- linked_answer_object_ids
- updated_at
- status

---

## 4. eligibility_rules 구조

- rule_id
- if
- then
- priority

---

## 5. recommended_routes 구조

- route_id
- label
- conditions
- target
- priority

---

## 6. Guardrail

- boundary 대응 rule 없으면 publish 불가
- high-risk면 consult-first route를 지원해야 함
- proof/trust 약한 상태에서 aggressive buy CTA 금지
- paused 상태에서는 primary CTA 비활성 가능

---

## 7. Surface projection

### Action Module
- action goal
- recommended routes
- note on why this route is suggested

### Buy-or-Consult Page
- primary route cards
- boundary precheck
- consult gate

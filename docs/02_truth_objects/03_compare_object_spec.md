# CompareObject Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 CompareObject의 구조와 비교 로직을 정의한다.

---

## 2. 역할

CompareObject는 둘 이상의 선택지를 차이 / fit by case / trade-off / recommendation logic으로 정리하는 정본이다.

단순 차이표가 아니라 “누구에게 어느 선택지가 더 맞는가”를 설명해야 한다.

---

## 3. 핵심 필드

- object_id
- canonical_question_id
- title
- compare_targets
- difference_dimensions
- fit_by_case
- trade_offs
- recommendation_logic
- reviewer_ids
- evidence_ids
- linked_boundary_object_ids
- linked_proof_object_ids
- linked_action_object_ids
- updated_at
- version
- status

---

## 4. compare_targets 구조

각 target은 최소 아래를 가진다.

- target_id
- label
- type
- tenant_scope

---

## 5. difference_dimensions 규칙

반드시 2개 이상 비교 차원을 가져야 한다.

예:
- 핵심 목적
- 추천 상황
- 사용감
- risk / caution
- 예산 / 강도

---

## 6. fit_by_case 규칙

CompareObject는 반드시 case-based recommendation을 포함한다.

예:
- 장벽 약화 + 민감 → 장벽 크림
- 지성 + 여름 → 수분 크림

---

## 7. Guardrail

- superiority 표현은 proof 없이 금지
- high-risk compare는 boundary object 필수
- trade-off 없는 compare는 publish 불가
- fit_by_case 없는 compare는 incomplete 처리

---

## 8. Surface projection

### Compare Page
- compare hero
- compare matrix
- fit by case
- trust block
- boundary block
- action module

### Compare Card
- 차이 2~3개
- 추천 상황 1개
- 더보기 링크

# AnswerObject Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 AnswerObject의 역할, 필드, 상태, 링크, surface projection 규칙을 정의한다.

---

## 2. 역할

AnswerObject는 특정 Canonical Question에 대한 공식 직답 정본이다.

주요 책임:
- 질문에 대한 short answer 제공
- full answer 제공
- 판단 기준 제공
- fit summary 제공
- 관련 proof / boundary / action으로 연결

---

## 3. 사용 장면

- ENTRY
- FIT
- TYPE
- ING 일부
- USE 일부
- BRAND 일부

---

## 4. 핵심 필드

- object_id
- canonical_question_id
- title
- answer_short
- answer_full
- decision_criteria
- fit_summary
- reviewer_ids
- evidence_ids
- linked_boundary_object_ids
- linked_proof_object_ids
- linked_action_object_ids
- next_question_ids
- status
- review_state
- version
- updated_at

---

## 5. fit_summary 구조

### recommended_for
이 답이 특히 적합한 사용자/상황

### caution_for
주의가 필요한 사용자/상황

### not_for
비적합한 사용자/상황

---

## 6. required validation

publish 전 아래를 만족해야 한다.

- answer_short 존재
- answer_full 존재
- decision_criteria 1개 이상
- evidence_ids 존재
- medium/high risk이면 boundary object 존재
- review_state가 allowed state

---

## 7. 상태 전이

draft
→ in_review
→ approved
→ published
→ deprecated

---

## 8. Surface projection

### Topic Answer Page
- question title
- answer_short
- answer_full
- decision_criteria

### Brand Fit Page
- fit_summary
- who-its-for / caution / not-for

### AI Projection
- short answer
- boundary summary
- reviewer summary
- next questions

---

## 9. Guardrail

- evidence 없음: publish 불가
- high-risk인데 boundary 없음: publish blocked
- answer_short 과도 단정적: review_blocked 가능
- 의료 오해 표현: human review mandatory

# BoundaryObject Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 비적합 조건, 주의사항, 오해 방지, 상담 escalation 규칙을 담는 BoundaryObject를 정의한다.

---

## 2. 역할

BoundaryObject는 다음을 담당한다.

- do-not-misread
- caution cases
- incompatible conditions
- expectation boundaries
- escalation rules

---

## 3. 핵심 필드

- object_id
- canonical_question_id
- title
- do_not_misread
- caution_cases
- incompatible_conditions
- expectation_boundaries
- escalation_rules
- linked_proof_object_ids
- linked_action_object_ids
- reviewer_ids
- evidence_ids
- updated_at
- status

---

## 4. caution_cases 구조

각 case는 최소 아래를 가진다.

- case_id
- label
- severity
- recommended_route

---

## 5. escalation_rules 구조

- trigger
- route
- note(optional)

---

## 6. high-risk 규칙

high-risk scene에서 BoundaryObject는 필수다.

추가 규칙:
- consult rule 없으면 publish blocked 가능
- do_not_misread 비어 있으면 trust surface 연계 불가
- stale critical evidence면 urgent_review

---

## 7. Surface projection

### Boundary Block
- do_not_misread
- caution cases
- expectation boundaries

### Consult Gate
- escalation rules
- safer route
- reduced route

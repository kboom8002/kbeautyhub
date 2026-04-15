# Object Linkage Rules
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 Object 간 링크 규칙과 no dead-end 규칙을 정의한다.

---

## 2. 기본 링크 타입

- proof_of
- boundary_of
- action_after
- compare_with
- answer_for
- handoff_to_brand
- handoff_to_expert

---

## 3. 필수 링크 규칙

### AnswerObject
must:
- at least one BoundaryObject

should:
- ProofObject
- ActionObject

### CompareObject
must:
- at least one BoundaryObject
- at least one ActionObject

should:
- ProofObject

### ProofObject
must:
- EvidenceSSoT
- PersonSSoT

### BoundaryObject
must:
- at least one ActionObject or consult route

### ActionObject
must:
- at least one BoundaryObject

---

## 4. No dead-end 규칙

published object는 최소 하나 이상을 가져야 한다.

- next_question_ids
- linked_action_object_ids
- consult_route
- brand_handoff
- recovery_route

---

## 5. invalid link 예시

- ProofObject → unrelated CompareObject
- high-risk AnswerObject with no BoundaryObject
- ActionObject with no risk gate
- self-loop without explicit reason

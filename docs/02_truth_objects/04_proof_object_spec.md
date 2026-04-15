# ProofObject Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 claim의 근거와 reviewer 책임을 표현하는 ProofObject를 정의한다.

---

## 2. 역할

ProofObject는 특정 claim이 왜 성립하는지, 어떤 evidence가 연결되는지, 누가 어떤 범위에서 검토했는지를 보여주는 trust 핵심 엔티티다.

---

## 3. 핵심 필드

- object_id
- canonical_question_id
- title
- claim_text
- claim_scope
- evidence_items
- reviewer_statements
- confidence_level
- evidence_grade
- limitations
- updated_reason
- linked_answer_object_ids
- updated_at
- status

---

## 4. claim_scope

다음을 포함한다.

- applies_to
- does_not_apply_to
- brand_scope
- topic_scope
- risk_scope

---

## 5. evidence_items

각 evidence item은 최소 아래를 가진다.

- evidence_id
- role
- strength

---

## 6. reviewer_statements

각 statement는 아래를 가진다.

- person_id
- scope
- statement_summary

---

## 7. Publish 규칙

- evidence_items 최소 1개
- reviewer_statements 최소 1개 또는 reviewed badge 없음
- limitations 필수
- claim_scope와 claim_text 일치 필요

---

## 8. Surface projection

### Trust Block
- claim_text
- reviewer summary
- evidence summary
- limitations
- updated_at

### Proof Page
- full evidence tree
- reviewer panel
- changelog

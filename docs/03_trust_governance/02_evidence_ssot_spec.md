# Evidence SSoT Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 claim을 지지하는 근거 정본인 Evidence SSoT를 정의한다.

---

## 2. evidence_type

- ingredient_rationale
- protocol_doc
- test_result
- certification
- process_record
- case_summary
- product_spec
- expert_note
- policy_doc
- benchmark_compare

---

## 3. 핵심 필드

- evidence_id
- title
- evidence_type
- summary
- provenance
- owner_person_id
- owner_team
- validity_window
- freshness_policy
- evidence_grade
- confidence_level
- applicable_claim_types
- topic_tags
- brand_scope
- linked_claim_ids
- linked_object_ids
- limitations
- status
- last_validated_at

---

## 4. evidence_grade

- A
- B
- C
- D

### 의미
- A: strong trust use 가능
- B: 일반 운영 가능
- C: 제한적 참고
- D: 핵심 publish 근거로 부적합

---

## 5. freshness 정책

- refresh_cycle_days
- stale_after_days

high-risk domain/topic은 더 짧은 주기를 적용 가능

---

## 6. 운영 규칙

- limitations 없는 evidence는 trust block 주 근거로 쓰지 않는다
- stale critical evidence는 high-risk publish를 막을 수 있다
- evidence owner가 비어 있으면 refresh 책임이 불명확한 상태다

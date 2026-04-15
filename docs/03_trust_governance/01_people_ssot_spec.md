# People SSoT Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 reviewer, approval owner, evidence owner, brand representative 등을 구조적으로 표현하는 People SSoT를 정의한다.

---

## 2. 핵심 원칙

People SSoT의 핵심은 “누구인가”보다 “무엇을 어디까지 검토 가능한가”이다.

---

## 3. person_type

- domain_reviewer
- evidence_owner
- approval_owner
- editorial_owner
- governance_admin
- brand_representative
- external_expert

---

## 4. 핵심 필드

- person_id
- display_name
- person_type
- headline_role
- organization
- credentials_summary
- bio_short
- active_status
- visibility_status
- review_scopes
- linked_object_ids
- linked_brand_ids
- last_reviewed_at
- availability_status
- conflict_of_interest_flags

---

## 5. visibility_status

- private_internal
- public_summary
- public_profile
- hidden

---

## 6. 운영 규칙

- reviewer badge는 scope가 유효할 때만 사용 가능
- 만료된 scope는 reviewed badge 계산에 포함하지 않는다
- public_profile은 별도 expert page 연결 가능
- conflict_of_interest는 runtime 표시 정책에 영향을 줄 수 있다

# Review Scope Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 reviewer scope와 claim/risk/brand 범위의 정합성을 정의한다.

---

## 2. 핵심 필드

- scope_id
- person_id
- vertical_id
- topic_tags
- claim_types
- risk_ceiling
- brand_scope
- product_scope
- approval_rights
- valid_from
- valid_to
- status

---

## 3. claim_types 예시

- fit
- usage
- boundary
- proof
- compare
- action_routing_note

---

## 4. risk_ceiling

- low
- medium
- high

---

## 5. scope validation 규칙

- claim_type이 scope 밖이면 reviewed badge 금지
- risk_level이 risk_ceiling 초과면 invalid
- brand-specific claim인데 brand_scope mismatch면 invalid
- valid_to 경과면 stale scope 처리

---

## 6. runtime 영향

scope mismatch는 아래에 영향을 준다.

- reviewed badge 노출
- publish blocking
- trust bundle completeness
- proof surface readiness

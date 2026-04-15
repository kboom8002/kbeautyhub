# ChangeLog Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 object, trust, surface, governance 변경 사항을 기록하는 ChangeLog 구조를 정의한다.

---

## 2. 핵심 필드

- change_log_id
- entity_type
- entity_id
- change_type
- change_reason
- trigger_source
- summary_before
- summary_after
- requested_by
- approved_by
- implemented_by
- effective_at
- linked_patch_ticket_id
- linked_retest_run_id
- visibility

---

## 3. change_type

- content_patch
- evidence_refresh
- boundary_update
- reviewer_change
- urgency_fix
- deprecation
- rollback

---

## 4. visibility

- internal_only
- public_summary
- hidden

---

## 5. public summary 규칙

공개 changelog는 다음 수준까지만 노출한다.

- 무엇이 바뀌었는가
- 왜 바뀌었는가
- 언제 바뀌었는가
- 영향 범주가 무엇인가

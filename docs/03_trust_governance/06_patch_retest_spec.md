# Patch / Retest Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 anomaly → patch → retest → close 흐름을 정의한다.

---

## 2. patch_ticket 핵심 필드

- patch_ticket_id
- entity_type
- entity_id
- trigger_source
- issue_type
- severity
- summary
- proposed_fix
- assigned_owner_id
- reviewer_needed_ids
- status
- created_at

---

## 3. patch status

- open
- triaged
- in_fix
- review_pending
- retest_pending
- closed

---

## 4. retest_run 핵심 필드

- retest_run_id
- patch_ticket_id
- entity_type
- entity_id
- test_scope
- baseline_window
- observation_window
- success_criteria
- status

---

## 5. retest 결과

- passed
- failed
- inconclusive

---

## 6. close 규칙

patch는 retest 없이 close할 수 없다.

예외:
- purely internal metadata patch
- runtime/public 영향 없음
- governance admin explicit exemption

---

## 7. 실패 후 처리

retest failed 시:
- patch reopen
- RCA 재평가
- severity 재산정 가능
- watch 또는 urgent_review로 전환 가능

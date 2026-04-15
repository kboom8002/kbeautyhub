# Patch Ops Board
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 alert → RCA → patch → retest → close를 운영하는 Patch Ops Board 구조를 정의한다.

---

## 2. 보드 컬럼

- intake
- triage
- rca_assigned
- fix_in_progress
- review_pending
- retest_running
- watch_window
- closed
- blocked

---

## 3. 카드 단위

Patch Ops Board의 카드 단위는 `patch_ticket`이다.

핵심 필드:
- patch_ticket_id
- severity
- priority
- mri_type
- entity_type
- entity_id
- primary_alert_id
- rca_codes
- patch_type
- owner
- reviewer_needed_ids
- sla_hours
- retest_required
- status

---

## 4. priority 계산 원칙

다음 요소를 합산해 priority를 계산한다.

- risk weight
- severity weight
- traffic weight
- conversion impact
- trust impact

### Priority bands
- P0
- P1
- P2
- P3
- P4

---

## 5. patch type

- answer_content_patch
- proof_bundle_patch
- boundary_patch
- surface_layout_patch
- routing_patch
- action_rule_patch
- freshness_refresh
- reviewer_reassignment
- brand_positioning_patch
- analytics_fix

---

## 6. 운영 규칙

- P0/P1은 일간 triage 대상
- high-risk trust/boundary 이슈는 surface 이슈보다 우선
- retest 없는 close 금지
- blocked column은 governance admin explicit action 필요

---

## 7. 보드 카드 예시

- high-risk scene에서 boundary visibility 낮음
- stale critical evidence linked to brand fit page
- compare page generic collapse 증가
- brand proof page 미연결로 readiness 저하

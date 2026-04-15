# Governance Workflow
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 review / publish / stale / patch / retest를 포함한 governance 루프를 정의한다.

---

## 2. 운영 루프

질문 자산
→ 정본 생성
→ evidence 연결
→ reviewer 검토
→ publish
→ D-MRI/B-MRI 측정
→ anomaly 탐지
→ RCA
→ patch
→ retest
→ republish or close

---

## 3. review workflow

draft
→ evidence_attached
→ reviewer_assigned
→ in_review
→ conditionally_approved or approved
→ published

---

## 4. publish blocking 조건

- required evidence missing
- reviewer scope mismatch
- high-risk인데 boundary missing
- stale critical evidence only
- required slot render 불가

---

## 5. governance_status

- healthy
- watch
- patch_required
- urgent_review
- blocked
- deprecated

---

## 6. stale 대응

- warning: watch
- critical stale: patch_required 또는 urgent_review
- high-risk + critical stale: blocked 가능

---

## 7. auditability

모든 governance action은 아래를 남겨야 한다.

- actor
- timestamp
- entity
- previous state
- next state
- reason
- linked changelog / patch / retest id

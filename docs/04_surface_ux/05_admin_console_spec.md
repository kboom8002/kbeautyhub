# Admin Console Spec
Version: v1

---

## 1. 문서 목적

이 문서는 internal admin/ops console의 정보 구조와 핵심 화면을 정의한다.

---

## 2. 상위 IA

- /dashboard
- /question-capital
- /canonical-questions
- /scenes
- /objects
- /surfaces
- /trust/people
- /trust/evidence
- /trust/claims
- /governance/reviews
- /governance/patches
- /governance/retests
- /governance/changelog
- /governance/stale-center
- /mri/overview
- /mri/alerts
- /mri/rca
- /brands
- /factory
- /media
- /settings

---

## 3. 핵심 화면

### Dashboard
- P0/P1 alerts
- blocked objects
- stale critical evidence
- overdue reviews
- patch SLA breach
- retest running
- brand watchlist

### CQ Registry
- CQ ID
- title
- family
- risk
- linked scenes
- linked objects

### Scene Registry
- scene id
- representative query
- intent
- scenario
- risk
- required objects
- health

### Object Studio
- overview
- subtype content editor
- link graph
- trust panel
- publish checklist
- metrics sparkline

### Surface Preview Lab
- scene + surface + tenant 입력
- slot inspector
- render preview
- fallback slot log

### Trust Center
- people tab
- evidence tab
- expiring scopes
- stale evidence

### Reviews Queue
- assigned reviewer
- due at
- missing requirements
- approve / reject / conditional approve

### Patch Board
- kanban by status
- severity
- RCA codes
- owner
- SLA

### MRI Overview
- D-MRI
- B-MRI
- alerts
- RCA distribution
- brand watchlist

### Brand Workspace
- brand truth
- products
- brand objects
- proof
- fit
- buy-or-consult
- readiness score

---

## 4. 권한 원칙

- reviewer는 publish 직접 불가
- brand operator는 shared template 변경 불가
- governance admin은 blocked/unblock 권한 보유
- analyst는 write 없이 read-only

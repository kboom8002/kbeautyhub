# Runtime Screen Spec
Version: v1

---

## 1. 문서 목적

이 문서는 public runtime screens의 목적, route, required blocks, 주요 이벤트를 정의한다.

---

## 2. 핵심 screens

### Search Entry
Route:
- /search

핵심 요소:
- search input
- resolved question chip
- first answer preview
- risk badge
- route cards

### Topic Answer
Route:
- /answers/{canonical_question_slug}

필수:
- answer hero
- answer body
- trust block
- boundary block
- next questions
- action module

### Compare
Route:
- /compare/{compare_slug}

필수:
- compare matrix
- fit by case
- trust block
- boundary block
- action module

### Routine Guide
Route:
- /routines/{routine_slug}

필수:
- stepper
- timing/frequency
- caution
- trust summary
- action module

### Proof
Route:
- /proof/{proof_slug}

필수:
- proof ribbon
- reviewer panel
- evidence panel
- limitations
- changelog

### Boundary / Consult
Route:
- /boundaries/{boundary_slug}

필수:
- safety intro
- do-not-misread
- caution cases
- consult gate
- safer alternatives

### Brand Start
Route:
- /start or /brands/{brand_slug}

필수:
- brand truth intro
- top questions
- fit entry
- proof entry
- buy-or-consult entry

### Brand Fit
Route:
- /fit/{fit_slug}

필수:
- fit summary
- who-its-for
- who-its-not-for
- trust block
- boundary block
- action

### Buy-or-Consult
Route:
- /buy-or-consult

필수:
- eligibility check
- route cards
- boundary precheck
- consult gate

---

## 3. high-risk UX 규칙

- boundary early
- consult-first 가능
- buy-only flow 금지
- stale critical이면 blocked

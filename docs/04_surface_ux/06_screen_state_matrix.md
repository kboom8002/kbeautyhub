# Screen State Matrix
Version: v1

---

## 1. 문서 목적

이 문서는 runtime/admin 주요 화면의 상태와 처리 규칙을 정의한다.

---

## 2. 공통 state enum

- loading
- ready
- partial
- warning
- blocked
- stale
- empty
- permission_denied

---

## 3. Runtime state rules

### Topic Answer
- loading: compose 전, skeleton
- ready: answer/trust/boundary 정상
- partial: low-risk + proof 약함
- warning: stale or medium risk
- blocked: high-risk + boundary missing
- empty: resolve 실패, safer questions 제공

### Compare
- ready: compare/trust/boundary 존재
- partial: trust 약함
- warning: medium/high risk compare
- blocked: high-risk + boundary missing

### Brand Fit
- ready: fit + proof + who/not-for
- partial: proof incomplete
- warning: stale proof
- blocked: who-its-not-for missing

### Buy-or-Consult
- ready: action + boundary + trust
- warning: medium risk
- blocked: high risk + consult route missing
- stale: stale trust → buy disabled, consult only

---

## 4. CTA gating matrix

### low risk
- trust sufficient + boundary sufficient → buy primary 가능

### medium risk
- trust sufficient + boundary sufficient → buy/consult 병렬

### medium risk + weak trust
- soft buy only
- trust 강조

### high risk
- consult primary
- buy secondary 또는 hidden

### high risk + missing boundary
- blocked

---

## 5. QA 필수 체크

- high-risk에서 boundary block fold 금지
- reviewed badge 조건 위반 시 비노출
- stale critical이면 buy CTA 비활성
- next question 또는 safer route 없으면 screen fail

# Acceptance Criteria
Version: v1

---

## 1. 문서 목적

이 문서는 capability 단위의 완료 기준을 정의한다.

---

## 2. Query Resolution Capability

완료 기준:
- query 입력 시 CQ + scene 반환
- confidence와 risk_level 반환
- ambiguity 시 safer fallback scene 제공
- trace_id 유지
- invalid query도 dead-end 없이 fallback 가능

---

## 3. Object Runtime Capability

완료 기준:
- scene별 required object set 조립 가능
- high-risk scene에서 boundary 누락 시 invalid
- object links 시각화 가능
- object publish 후 projection refresh 발생

---

## 4. Trust Capability

완료 기준:
- reviewer scope와 claim/risk 일치 검증 가능
- stale evidence 판정 가능
- trust block에 reviewer/evidence/limitations/updatedAt 보임
- reviewed badge 조건 위반 시 비노출
- stale critical evidence는 high-risk publish 차단

---

## 5. Runtime UX Capability

완료 기준:
- Topic Answer / Compare / Routine / Proof / Boundary / Brand Fit / Buy-or-Consult 동작
- 모든 핵심 화면에 next question 또는 safer route 존재
- high-risk는 consult-first 가능
- slot fallback render 존재
- runtime event firing 검증 완료

---

## 6. Governance Capability

완료 기준:
- review assign / approve / reject / conditional approve 가능
- publish blocking reason 구조화
- patch ticket 생성 가능
- retest plan 생성 가능
- changelog 조회 가능

---

## 7. D-MRI Capability

완료 기준:
- runtime events 적재
- scene/object/surface snapshot 생성
- alerts 생성
- patch board 연결
- retest 결과 반영

---

## 8. Brand Mini B-SSoT Capability

완료 기준:
- brand truth profile 존재
- who-its-for / who-its-not-for 존재
- brand proof page 존재
- buy-or-consult consult route 존재
- readiness score 계산 가능

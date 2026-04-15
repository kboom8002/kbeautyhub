# RCA Taxonomy
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 D-MRI/B-MRI 이상 징후를 일관된 원인군 코드로 분류하기 위한 RCA taxonomy를 정의한다.

---

## 2. 상위 taxonomy

- RCA-QA
- RCA-TR
- RCA-SF
- RCA-GR
- RCA-ACT
- RCA-GOV
- RCA-BR
- RCA-DATA

---

## 3. 상위군 설명

### RCA-QA
Question / Answer Asset 문제

### RCA-TR
Trust Layer 문제

### RCA-SF
Surface / UX 문제

### RCA-GR
Graph / Routing 문제

### RCA-ACT
Action / Commerce 문제

### RCA-GOV
Governance / Freshness 문제

### RCA-BR
Brand Strategy 문제

### RCA-DATA
Measurement / Instrumentation 문제

---

## 4. 상세 코드

### RCA-QA
- RCA-QA-01 canonical framing 부정확
- RCA-QA-02 answer_short 과도 단정/모호
- RCA-QA-03 decision_criteria 부족
- RCA-QA-04 fit_by_case 부족
- RCA-QA-05 answer-scene mismatch
- RCA-QA-06 object bundle 과다/과소

### RCA-TR
- RCA-TR-01 proof 부족
- RCA-TR-02 reviewer scope mismatch
- RCA-TR-03 evidence grade 약함
- RCA-TR-04 limitations 미표시
- RCA-TR-05 boundary 부족
- RCA-TR-06 consult escalation 규칙 약함

### RCA-SF
- RCA-SF-01 trust block visibility 낮음
- RCA-SF-02 boundary block placement 부적절
- RCA-SF-03 answer hero 과밀/과소
- RCA-SF-04 compare matrix 이해 어려움
- RCA-SF-05 action CTA 과도/약함
- RCA-SF-06 next question relevance 낮음

### RCA-GR
- RCA-GR-01 scene resolve precision 낮음
- RCA-GR-02 next edge 품질 낮음
- RCA-GR-03 safer route 부재
- RCA-GR-04 brand handoff timing 부적절
- RCA-GR-05 bridge question 누락

### RCA-ACT
- RCA-ACT-01 eligibility rule 부정확
- RCA-ACT-02 consult-first gating 부족
- RCA-ACT-03 action route 설명 부족
- RCA-ACT-04 attribution rule 문제
- RCA-ACT-05 buy/consult balance 왜곡

### RCA-GOV
- RCA-GOV-01 stale evidence
- RCA-GOV-02 reviewer validity 만료
- RCA-GOV-03 changelog 부실
- RCA-GOV-04 urgent review 지연
- RCA-GOV-05 patch close 후 retest 실패 반복

### RCA-BR
- RCA-BR-01 brand differentiation 약함
- RCA-BR-02 generic collapse 높음
- RCA-BR-03 brand proof insufficiency
- RCA-BR-04 who-its-for / not-for 불균형
- RCA-BR-05 persona mismatch

### RCA-DATA
- RCA-DATA-01 event firing 누락
- RCA-DATA-02 scene tagging 오류
- RCA-DATA-03 sample size 부족
- RCA-DATA-04 attribution window 왜곡
- RCA-DATA-05 analytics join stale

---

## 5. 우선 RCA 규칙

- high-risk에서는 Trust/Governance 원인을 먼저 본다
- 그 다음 Surface
- 그 다음 Graph/Action
- 마지막에 Data 품질을 본다

---

## 6. 운영 사용 규칙

- alert는 최소 primary RCA 1개와 optional secondary RCA를 가진다
- patch ticket에는 RCA codes가 남아야 한다
- retest 실패가 반복되면 RCA 재분류 가능하다

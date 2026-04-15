# B-MRI Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 브랜드/엔티티 수준의 설명력, 권위, 신뢰, 차별화, 행동 readiness를 측정하는 B-MRI를 정의한다.

---

## 2. B-MRI 정의

B-MRI는 brand/entity/topic-slice 수준에서 answer share, official citation, trust integrity, differentiation, commerce readiness를 관측하는 전략형 MRI다.

핵심 질문:
- 이 브랜드가 관련 질문군에서 공식 정답 주체로 자리 잡고 있는가?
- 이 브랜드는 generic collapse 없이 자기 차이를 설명하는가?
- trust/proof/boundary가 충분한가?
- safe action으로 이어지는가?

---

## 3. 측정 단위

- Brand MRI
- Line MRI
- Topic Slice MRI
- Portfolio MRI

---

## 4. 차원

- answer_share
- source_share
- official_citation
- explanatory_power
- trust_integrity
- persona_alignment
- differentiation
- commerce_readiness

---

## 5. 차원 설명

### answer_share
브랜드가 관련 질문 surface에서 얼마나 진입/선택되는가

### source_share
브랜드 proof/evidence가 얼마나 참조되는가

### official_citation
공식 answer surface로 얼마나 연결되는가

### explanatory_power
브랜드가 자기 차이를 얼마나 설명하는가

### trust_integrity
proof/reviewer/boundary/changelog가 충분한가

### persona_alignment
핵심 persona에 맞는 fit/action 구조를 갖췄는가

### differentiation
generic answer에 묻히지 않고 차이를 보이는가

### commerce_readiness
trust 이후 safe action으로 이어지는가

---

## 6. 점수 구조

- answer_share: 15
- source_share: 10
- official_citation: 15
- explanatory_power: 15
- trust_integrity: 15
- persona_alignment: 10
- differentiation: 10
- commerce_readiness: 10

---

## 7. 핵심 metric

- brand_answer_entry_share
- brand_fit_surface_ctr
- brand_proof_attach_rate
- official_surface_visit_rate
- trust_bundle_completeness
- differentiation_score
- generic_collapse_rate
- persona_fit_conversion_rate
- safe_brand_action_rate

### topic slice metrics
- topic_brand_win_rate
- topic_proof_strength_index
- topic_boundary_integrity

---

## 8. 등급

- A: 85~100
- B: 70~84
- C: 55~69
- D: 40~54
- F: 0~39

### 운영 해석
- C: 브랜드 설명력 보강 필요
- D: generic collapse 또는 trust deficiency
- F: brand fit/proof/action 재설계 필요

---

## 9. 주요 alert 예시

- official_surface_visit_rate 하락
- trust_bundle_completeness 부족
- generic_collapse_rate 상승
- topic_proof_strength_index 저하
- safe_brand_action_rate 저하

---

## 10. 운영 규칙

- B-MRI는 주간/월간 단위 리뷰에 더 적합하다
- brand launch readiness score와 연동 가능하다
- D-MRI 이상은 B-MRI 악화로 이어질 수 있으므로 함께 본다

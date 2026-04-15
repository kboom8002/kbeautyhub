# Domain Definition: K-Beauty Skincare
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 K-Beauty Skincare Vertical AEO Hub의 도메인 경계와 운영 원칙을 정의한다.

---

## 2. 버티컬 정의

K-Beauty Skincare Vertical AEO Hub는 사용자의 피부 고민, 피부 타입, 제품 유형, 성분, 루틴, 비교, 적합성, 사용법, 안전성, 브랜드 차별점을 질문 단위로 정리하고, 이를 공식 정답 / 비교 / 근거 / 경계 / 행동 구조로 연결하는 버티컬 Answer Gateway다.

---

## 3. 포함 범위

### 피부 고민
- 건조
- 민감
- 장벽 약화
- 트러블
- 피지
- 모공
- 칙칙함/톤
- 탄력
- 홍조
- 각질/결

### 제품군
- 클렌저
- 토너
- 패드
- 에센스
- 세럼
- 앰플
- 크림
- 젤 크림
- 선케어
- 마스크
- 스팟 케어

### 질문 장면
- 적합성
- 비교
- 성분 이해
- 사용 순서
- 병행 사용
- 주의사항
- 효과 기대치
- 루틴 시작
- 구매/상담 결정

---

## 4. 제외 또는 후순위

- 색조 메이크업
- 헤어/바디
- 의학적 진단/치료 확정
- 질환 치료 claim
- 규제 리스크가 큰 의료적 판단

---

## 5. 도메인 성격

이 버티컬은 Generic 기반이지만 YMYL-lite discipline으로 운영한다.

의미:
- 일반 소비재 중심 도메인이다
- 그러나 민감/자극/병행 사용/주의/상담 필요 장면은 high-risk 정책을 적용한다

---

## 6. 고정 ontologies

### skin_type_tags
- dry
- oily
- combination
- sensitive

### concern_tags
- barrier
- soothing
- acne
- sebum
- pore
- tone
- elasticity

### routine_phase_tags
- cleanse
- prep
- treat
- moisturize
- protect

### caution_tags
- beginner_caution
- active_combo_caution
- irritation_recovery

---

## 7. high-risk topics

다음 topic은 resolver, surface, governance, MRI에서 high-risk profile을 적용한다.

- sensitive_skin_fit
- barrier_recovery
- active_combo_safety
- irritation_recovery
- consult_needed_cases

---

## 8. Answer Commerce 원칙

이 버티컬의 commerce는 질문 → 정답/비교 → 신뢰/경계 → 행동 구조를 따른다.

### 허용되는 행동
- 루틴 저장
- 제품 시작
- 샘플/체험
- 상담
- 구매

### 금지되는 방향
- proof/boundary 없이 aggressive CTA
- high-risk 장면에서 buy-only 유도
- trust signal 없는 fit claim 강조

# Vertical Hub IA
Version: v1
Vertical: K-Beauty Skincare

---

## 1. IA 목적

이 IA는 Vertical AEO Hub public runtime의 정보 구조를 정의한다.

---

## 2. 상위 구조

- /questions
- /topics/{topic_slug}
- /answers/{canonical_question_slug}
- /compare/{compare_slug}
- /ingredients/{ingredient_slug}
- /routines/{routine_slug}
- /proof/{proof_slug}
- /boundaries/{boundary_slug}
- /actions/{action_slug}
- /experts/{person_slug}
- /evidence/{evidence_slug}
- /brands/{brand_slug}
- /stories/{story_slug}
- /search

---

## 3. GNB 제안

- 질문 찾기
- 고민별 보기
- 비교하기
- 루틴
- 근거/전문가
- 브랜드

---

## 4. Navigation 원칙

- tree보다 graph 우선
- topic에서 compare / proof / routine / brand로 연결
- proof와 boundary는 origin question backlink 제공
- 모든 페이지는 no dead-end를 만족

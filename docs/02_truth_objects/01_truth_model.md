# Truth Model
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 Answer Operating System에서 “공식 정답”이 어떤 구조로 표현되고 운영되는지 정의한다.

핵심 질문은 다음과 같다.

1. 무엇이 truth entity 인가
2. claim은 어떤 근거와 경계를 가져야 하는가
3. object와 page의 관계는 무엇인가
4. publish 가능한 truth의 최소 조건은 무엇인가

---

## 2. Truth Model의 기본 원칙

1. Question-first
2. Truth-first
3. Object-first, Page-later
4. Claim must be lineaged
5. Trust always visible
6. No dead-end
7. Every patch is a hypothesis

---

## 3. Truth Entity 계층

### L1. Canonical Question
질문의 공식 대표 서명

### L2. Object
질문에 대한 공식 정답/비교/근거/경계/행동 엔티티

### L3. Trust Attachments
reviewer, evidence, boundary, changelog, updatedAt

### L4. Surface Projection
page, block, card, AI projection

---

## 4. Core Truth Entities

- AnswerObject
- CompareObject
- ProofObject
- BoundaryObject
- ActionObject
- ClaimNode
- PersonSSoT
- EvidenceSSoT
- ChangeLog

---

## 5. Claim 모델

모든 핵심 답변은 claim 단위로 lineage를 가진다.

Claim은 아래를 포함한다.

- claim_text
- claim_strength
- linked_proof_object_ids
- linked_boundary_object_ids
- status

### 최소 규칙
- low-risk claim: evidence 또는 explicit limitation 필요
- medium-risk claim: evidence + reviewer 필요
- high-risk claim: evidence + reviewer + boundary 필요

---

## 6. Publish 가능한 truth의 최소 조건

### 공통
- canonical_question_id 존재
- object subtype required fields 충족
- evidence 연결
- updatedAt 존재
- version 존재

### medium/high risk 추가
- boundary 존재
- reviewer scope 유효
- trust surface projection 가능

---

## 7. Surface와의 관계

Surface는 truth의 source가 아니다.
Surface는 object bundle의 projection이다.

즉:
- page는 정답의 원천이 아님
- object가 정답의 원천
- page는 object를 표현하는 런타임 결과

---

## 8. Truth lifecycle

draft
→ in_review
→ approved
→ published
→ deprecated
→ archived

추가:
- published → in_review (patch review)
- published → deprecated (stale / risk / replacement)

# Surface Contract
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 Object bundle이 page/block/card/AI projection으로 어떻게 투영되는지 정의한다.

---

## 2. 기본 원칙

- Surface는 projection이다
- Surface는 truth source가 아니다
- Question-first
- Answer-first
- Trust always visible
- No dead-end
- high-risk는 boundary-first 또는 boundary-early
- 모든 주요 surface는 next question 또는 safer route를 가진다

---

## 3. Surface 계층

### L1 Page Surface
예: Topic Answer, Compare, Routine, Proof, Brand Fit

### L2 Block Surface
예: Trust Block, Boundary Block, Action Module

### L3 Inline/Micro Surface
예: Answer Card, Proof Ribbon, Next Question Card

---

## 4. 공통 shell

모든 주요 page surface는 아래를 기본 포함한다.

- question_context
- answer_hero
- answer_body
- trust_block
- boundary_block
- next_question_rail
- action_module
- updated_meta

---

## 5. Slot contract 공통 필드

- slot_id
- slot_type
- required
- visible
- priority
- data_source
- render_variant
- fallback_variant
- guardrail_flags
- cta_policy

---

## 6. 주요 shared blocks

- BLK-ANSWER-HERO
- BLK-ANSWER-BODY
- BLK-TRUST-BLOCK
- BLK-BOUNDARY-BLOCK
- BLK-ACTION-MODULE
- BLK-NEXT-QUESTION-RAIL

---

## 7. high-risk policy

high-risk surface는 아래를 따른다.

- boundary early placement
- consult-first 가능
- buy CTA 축소/secondary
- proof/trust visible
- safer route 필수
- stale critical이면 blocked

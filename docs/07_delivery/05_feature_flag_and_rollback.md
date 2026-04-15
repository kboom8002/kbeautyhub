# Feature Flag and Rollback
Version: v1

---

## 1. 문서 목적

이 문서는 feature flags와 rollback 전략을 정의한다.

---

## 2. 주요 flags

- ff_runtime_search_entry
- ff_compare_page
- ff_proof_page
- ff_consult_gate
- ff_brand_start_page
- ff_brand_buy_or_consult
- ff_dmri_live
- ff_bmri_live
- ff_factory_instantiate
- ff_ai_projection_live

---

## 3. flag 원칙

- runtime/admin flags 분리
- tenant/topic/brand scope 지원
- high-risk feature는 세분화된 scope 필요
- kill switch 우선 확보

---

## 4. rollback 유형

- content rollback
- surface rollback
- trust rollback
- feature rollback
- brand rollback
- consult-safe rollback

---

## 5. 긴급 규칙

high-risk topic에서 critical trust/boundary 문제 발생 시:

1. public buy CTA off
2. consult-first 강제
3. affected object deprecated or blocked
4. stale warning 또는 temporary unavailable 표시
5. urgent review / patch 시작

---

## 6. audit 규칙

모든 flag change / rollback action은 audit log를 남긴다.

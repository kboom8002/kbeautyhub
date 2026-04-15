# Seed Strategy
Version: v1

---

## 1. 문서 목적

이 문서는 MVP 부팅과 preview, QA, demo를 위한 seed 전략을 정의한다.

---

## 2. seed 목표

- 시스템이 비어 있지 않게 한다
- runtime preview가 즉시 가능하게 한다
- high-risk policy를 seed 단계부터 반영한다
- admin/gov/mri flow를 최소 수준으로 검증 가능하게 한다

---

## 3. seed 구성

- vertical seed
- question capital seed
- canonical question seed
- scene seed
- object seed
- people seed
- evidence seed
- surface contract seed
- risk policy seed
- feature flag seed

---

## 4. 운영 원칙

- seed는 deterministic해야 한다
- re-run 가능해야 한다
- local/dev/staging에서 동일 구조로 사용 가능해야 한다
- public runtime preview가 가능한 minimum truth를 포함해야 한다

---

## 5. 필수 seed 품질 기준

- CQ 50 적재 가능
- scene 20 적재 가능
- P1 core object set 적재 가능
- high-risk topic rules 적재 가능
- admin 조회 가능
- runtime topic answer 최소 5개 이상 동작 가능

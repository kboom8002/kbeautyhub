# Rollout Release Plan
Version: v1

---

## 1. 문서 목적

이 문서는 internal alpha부터 controlled launch까지의 rollout 단계를 정의한다.

---

## 2. Rollout phases

### Phase 0: internal_alpha
범위:
- 1 vertical
- 10 CQ
- 5 scenes
- 2 surfaces
- internal only

### Phase 1: private_beta
범위:
- 1 vertical
- CQ 50
- scene 20
- core runtime surfaces
- admin/governance/mri consoles
- internal brand packs 1~2

### Phase 2: controlled_launch
범위:
- public vertical hub
- brand mini B-SSoT 1~3
- niche packs 2~3
- D-MRI live
- consult/buy routing live

### Phase 3: scale_launch
범위:
- more brands
- B-MRI live
- factory onboarding
- override governance
- reuse analytics

---

## 3. launch gates

- required slot render success 기준 충족
- high-risk boundary visibility 기준 충족
- trust bundle completeness 충족
- stale critical exposure = 0
- no dead-end compliance 충족
- rollback path 검증 완료

---

## 4. release unit

- feature release
- domain release
- brand release
- ops release

---

## 5. 운영 규칙

- high-risk topic은 좁게 열고 깊게 검증
- brand pack은 proof/trust readiness 없이는 public 오픈 금지
- private_beta 이전에 governance 없는 runtime 공개 금지

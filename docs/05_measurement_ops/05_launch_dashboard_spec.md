# Launch Dashboard Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 controlled beta / controlled launch / scale launch 전후로 확인할 Launch Dashboard 구성을 정의한다.

---

## 2. 핵심 카드

- rollout phase status
- feature flag status
- launch blockers
- open P0/P1 patches
- high-risk surface health
- stale critical count
- brand readiness score
- review queue aging
- retest running count

---

## 3. launch blocker 정의

다음은 blocker다.

- stale critical exposure 존재
- high-risk screen blocked unresolved
- trust bundle completeness 기준 미달
- required slot render success 미달
- P0 patch unresolved
- brand readiness score 미달

---

## 4. brand readiness score 요소

- proof completeness
- fit surface readiness
- boundary readiness
- action-consult balance
- top question coverage
- trust meta visibility

---

## 5. launch phase view

### internal_alpha
- 기본 runtime path 정상
- seed data integrity
- admin preview 가능

### private_beta
- trust/governance 동작
- D-MRI baseline live
- core surfaces live

### controlled_launch
- high-risk consult-first 검증 완료
- brand pack readiness 충족
- rollback path 검증 완료

### scale_launch
- B-MRI live
- factory instantiate live
- override governance live

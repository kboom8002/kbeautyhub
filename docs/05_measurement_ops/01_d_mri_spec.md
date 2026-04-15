# D-MRI Spec
Version: v1
Status: Active

---

## 1. 문서 목적

이 문서는 scene / object / surface / bundle 단위의 운영 품질을 측정하는 D-MRI를 정의한다.

D-MRI의 목적은 다음과 같다.

1. runtime 품질을 수치로 본다
2. trust / boundary / routing / action 품질을 분해해서 본다
3. alert와 RCA, patch로 이어질 수 있게 한다

---

## 2. D-MRI 정의

D-MRI는 scene/object/surface/bundle의 실행 품질을 진단하는 운영형 MRI다.

핵심 질문:
- 이 장면은 잘 작동하는가?
- 이 answer는 충분히 신뢰되는가?
- boundary는 충분히 보이는가?
- 다음 질문과 행동으로 잘 이어지는가?
- stale/trust 문제 없이 건강한가?

---

## 3. 측정 단위

### Scene MRI
예: `QIS-KBS-004`

### Object MRI
예: `OBJ-ANS-0101`

### Surface MRI
예: `SH-TOPIC-ANSWER`, `SB-BRAND-FIT`

### Bundle MRI
예: `BND-FIT-01`

---

## 4. D-MRI 차원

- answer_precision
- trust_sufficiency
- boundary_explicitness
- graph_connectivity
- action_readiness
- safe_handoff_quality
- freshness_integrity
- surface_clarity

---

## 5. 차원 설명

### answer_precision
질문 장면에 맞는 답인지

### trust_sufficiency
근거, reviewer, limitations, updatedAt가 충분히 보이는지

### boundary_explicitness
오해 방지/비적합/주의/consult gate가 충분히 보이는지

### graph_connectivity
next question / safer route / brand handoff가 잘 연결되는지

### action_readiness
적절한 행동으로 잘 이어지는지

### safe_handoff_quality
위험 장면에서 상담/안전 라우팅이 잘 되는지

### freshness_integrity
stale exposure가 없는지

### surface_clarity
화면이 이해와 선택을 잘 돕는지

---

## 6. 점수 구조

기본 100점 만점

- answer_precision: 20
- trust_sufficiency: 15
- boundary_explicitness: 15
- graph_connectivity: 10
- action_readiness: 15
- safe_handoff_quality: 10
- freshness_integrity: 10
- surface_clarity: 5

### high-risk override
high-risk scene에서는 아래를 더 크게 본다.

- boundary_explicitness
- safe_handoff_quality
- trust_sufficiency

---

## 7. 등급

- A: 85~100
- B: 70~84
- C: 55~69
- D: 40~54
- F: 0~39

운영 규칙:
- C 이하는 patch_required
- D는 urgent_review 후보
- F는 blocked 또는 consult-first only 검토

---

## 8. 핵심 metric

### Scene metrics
- scene_entry_ctr
- answer_expand_rate
- trust_expand_rate
- boundary_view_rate
- next_question_ctr
- fit_to_action_ctr
- compare_to_choice_ctr
- consult_route_rate
- safe_handoff_rate
- recovery_completion_rate

### Object metrics
- object_use_rate
- proof_attach_completeness
- boundary_attach_completeness
- object_stale_flag_rate
- object_patch_reopen_rate
- action_route_success_rate

### Surface metrics
- slot_render_success_rate
- trust_block_visibility_rate
- boundary_block_visibility_rate
- action_module_click_rate
- compare_matrix_interaction_rate
- changelog_open_rate

---

## 9. alert 규칙 예시

- trust_expand_rate 급락 → trust wording/layout RCA
- boundary_view_rate 낮음 in medium/high risk → boundary placement RCA
- next_question_ctr 낮음 → graph/routing RCA
- consult_route_rate 급등 → fit precision / boundary wording RCA
- stale exposure 증가 → freshness audit

---

## 10. runtime event 연결

D-MRI는 아래 event로 집계된다.

- scene_resolved
- answer_hero_view
- answer_expand_click
- trust_block_view
- trust_block_expand
- boundary_block_view
- boundary_block_expand
- next_question_click
- action_route_click
- consult_gate_open
- recovery_guide_start
- recovery_guide_complete
- stale_warning_seen

---

## 11. 운영 규칙

- high-risk scene은 boundary_view_rate 기준선을 별도로 둔다
- trust/boundary 없는 scene은 D-MRI를 정상 운영 상태로 간주하지 않는다
- new scene은 baseline 부족 상태로 표시하되 alert suppression window를 가질 수 있다

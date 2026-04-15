# Worker Boundary
Version: v1

---

## 1. 문서 목적

이 문서는 worker 단위 책임과 queue 기반 비동기 실행 경계를 정의한다.

---

## 2. Worker Registry

### Ingestion
- WKR-QUERY-NORMALIZER
- WKR-RAW-QUESTION-CLUSTERER
- WKR-BRAND-IMPORTER

### Resolution
- WKR-CANONICAL-MAPPER
- WKR-SCENE-RESOLVER
- WKR-NEXT-QUESTION-RANKER
- WKR-BRAND-HANDOFF-RANKER

### Assembly
- WKR-OBJECT-BUNDLE-COMPOSER
- WKR-TRUST-BUNDLE-COMPOSER
- WKR-SURFACE-PROJECTOR
- WKR-AI-PROJECTION-BUILDER

### Trust / Governance
- WKR-REVIEWER-SCOPE-VALIDATOR
- WKR-EVIDENCE-FRESHNESS-SCANNER
- WKR-PUBLISH-ORCHESTRATOR
- WKR-CHANGELOG-GENERATOR
- WKR-PATCH-ROUTER

### Measurement
- WKR-RUNTIME-EVENT-INGESTOR
- WKR-MRI-AGGREGATOR
- WKR-ALERT-ENGINE
- WKR-RCA-SUGGESTER
- WKR-RETEST-ORCHESTRATOR

### Factory
- WKR-TEMPLATE-INSTANTIATOR
- WKR-OVERRIDE-APPLIER
- WKR-BRAND-PACK-GENERATOR

---

## 3. 핵심 Worker 경계

### WKR-QUERY-NORMALIZER
입력:
- raw query
- locale
- vertical context

출력:
- normalized query
- intent hints
- entity hints
- rewrite variants

하지 않는 일:
- CQ 최종 확정
- scene 최종 선택

---

### WKR-CANONICAL-MAPPER
입력:
- normalized query
- candidate retrieval set

출력:
- candidate CQ IDs
- ambiguity flags
- confidence

하지 않는 일:
- 최종 scene 결정

---

### WKR-SCENE-RESOLVER
입력:
- CQ candidates
- persona/risk/user context
- prior scene trail

출력:
- final scene
- risk level
- fallback scenes
- surface recommendation

하지 않는 일:
- object bundle 조립
- CTA 판단

---

### WKR-OBJECT-BUNDLE-COMPOSER
입력:
- scene_id
- tenant scope
- brand scope
- risk policy

출력:
- ordered object ids
- missing required objects
- variant hints

하지 않는 일:
- trust badge 계산
- surface render

---

### WKR-TRUST-BUNDLE-COMPOSER
입력:
- object ids
- trust policies
- visibility rules

출력:
- trust bundle
- badges
- stale warnings
- scope validation summary

---

### WKR-SURFACE-PROJECTOR
입력:
- surface_id
- scene_id
- object bundle
- trust bundle
- risk policy
- tenant overrides

출력:
- render payload
- slot status
- variant
- fallback flags

---

### WKR-REVIEWER-SCOPE-VALIDATOR
입력:
- object / claim / risk / brand scope / reviewer ids

출력:
- valid / invalid
- reason codes
- escalation requirements

---

### WKR-EVIDENCE-FRESHNESS-SCANNER
입력:
- evidence set
- freshness policy
- linked graph

출력:
- stale flags
- refresh candidates
- critical block recommendations

---

### WKR-PUBLISH-ORCHESTRATOR
입력:
- publish command
- trust validation
- surface contract checks

출력:
- published
- conditionally_published
- blocked

---

### WKR-MRI-AGGREGATOR
입력:
- runtime events
- aggregation windows
- entity graph

출력:
- D-MRI snapshots
- B-MRI snapshots
- dimension scores

---

### WKR-ALERT-ENGINE
입력:
- MRI snapshots
- thresholds
- anomaly rules

출력:
- alerts
- severity
- RCA seed

---

### WKR-RCA-SUGGESTER
입력:
- alert
- recent metrics
- object graph
- surface contract

출력:
- primary RCA codes
- secondary RCA codes
- suggested patch types

---

### WKR-RETEST-ORCHESTRATOR
입력:
- patch ticket
- baseline metrics
- success template

출력:
- retest plan
- pass/fail/inconclusive

---

## 4. queue topics

### Commands
- cmd.query.normalize
- cmd.canonical.map
- cmd.scene.resolve
- cmd.object.bundle.compose
- cmd.trust.bundle.compose
- cmd.surface.project
- cmd.publish.object
- cmd.scan.evidence.freshness
- cmd.aggregate.mri
- cmd.suggest.rca
- cmd.route.patch
- cmd.run.retest
- cmd.instantiate.template
- cmd.generate.brand.pack

### Events
- evt.query.normalized
- evt.canonical.mapped
- evt.scene.resolved
- evt.object.bundle.composed
- evt.trust.bundle.composed
- evt.surface.projected
- evt.object.published
- evt.evidence.stale.flagged
- evt.mri.snapshot.created
- evt.mri.alert.created
- evt.rca.suggested
- evt.patch.ticket.created
- evt.retest.completed
- evt.template.instantiated
- evt.brand.pack.generated

---

## 5. 공통 원칙

- payload는 schema-first
- 모든 worker는 idempotency key를 가져야 한다
- LLM output은 JSON only
- LLM output은 draft 성격만 가진다
- publish / reviewer override / high-risk consult 완화는 human approval 필요

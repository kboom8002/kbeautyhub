import { describe, it, expect } from 'vitest';
import { SurfaceProjector } from '@/domain/surface/projector';
import { z } from 'zod';

const SurfaceRenderSchema = z.object({
  projection_id: z.string(),
  surface_id: z.string(),
  variant: z.string(),
  slots: z.array(z.object({
    slot_id: z.string(),
    slot_type: z.enum(["hero", "block", "rail", "card", "inline"]),
    required: z.boolean(),
    visible: z.boolean(),
    render_variant: z.string().nullable(),
    fallback_variant: z.string().nullable(),
    data: z.any()
  }))
});

describe('Surface Projector payload builder', () => {

  const mockAnswerBundle = {
    AnswerObject: { title: "Topic", answer_short: "Short", answer_full: "Full" },
    BoundaryObject: [{ caution_cases: ["Caution 1"] }],
    ProofObject: [{ object_id: "PRF-1" }]
  };

  it('generates Topic Answer with all required shared blocks and passes JSON Schema', () => {
    const payload = SurfaceProjector.project('SRF-ANS-001', 'TopicAnswer', mockAnswerBundle, {}, 'low');
    
    // 5. surface payload가 JSON schema를 통과
    const validationResult = SurfaceRenderSchema.safeParse(payload);
    expect(validationResult.success).toBe(true);

    // 1. Topic Answer payload가 answer/trust/boundary/next/action 슬롯 포함
    const slotNames = payload.slots.map((s: any) => s.slot_id.split('-')[1]);
    expect(slotNames).toContain('HERO');
    expect(slotNames).toContain('BODY');
    expect(slotNames).toContain('BND');
    expect(slotNames).toContain('TRUST');
    expect(slotNames).toContain('ACT');
    expect(slotNames).toContain('NEXT');
  });

  it('forces boundary early placement and constraints on high-risk', () => {
    const payload = SurfaceProjector.project('SRF-ANS-002', 'TopicAnswer', mockAnswerBundle, {}, 'high');
    
    expect(payload.variant).toBe('consult_first');
    
    const boundarySlot = payload.slots.find((s: any) => s.slot_id.includes('BND'));
    // 2. high-risk path에서 boundary slot visible=true
    expect(boundarySlot.visible).toBe(true);
    expect(boundarySlot.required).toBe(true);
    expect(boundarySlot.render_variant).toBe('early_placement_warning');

    const actionSlot = payload.slots.find((s: any) => s.slot_id.includes('ACT'));
    expect(actionSlot.data.buy_cta).toBe('secondary_or_hidden');
    expect(actionSlot.data.consult_cta).toBe('primary');

    // Boundary should be placed before BODY in high-risk
    const bndIndex = payload.slots.findIndex((s: any) => s.slot_id.includes('BND'));
    const bodyIndex = payload.slots.findIndex((s: any) => s.slot_id.includes('BODY'));
    expect(bndIndex).toBeLessThan(bodyIndex);
  });

  it('embeds fit_by_case in Compare surface', () => {
    const mockCompareBundle = {
      CompareObject: { comparison_matrix: {}, fit_by_case: ["Condition A"] }
    };
    const payload = SurfaceProjector.project('SRF-COMP-001', 'Compare', mockCompareBundle, {}, 'medium');

    const compSlot = payload.slots.find((s: any) => s.slot_id.includes('COMP'));
    // 3. compare surface에서 fit_by_case가 반드시 포함
    expect(compSlot.data.fit_by_case).toEqual(["Condition A"]);
  });

  it('returns blocked variant with safer route action module if required object missing', () => {
    const brokenBundle = {}; // Missing AnswerObject
    const payload = SurfaceProjector.project('SRF-ANS-ERR', 'TopicAnswer', brokenBundle, {}, 'high');

    // 4. blocked state에서 safer route 또는 consult path 존재
    expect(payload.variant).toBe('blocked');
    
    const actionSlot = payload.slots.find((s: any) => s.slot_id.includes('ACT'));
    expect(actionSlot.data.consult_cta).toBe('primary'); // Consult escape route given by high-risk builder wrapper
  });

  it('drops buy CTA to secondary and raises warning variant if evidence is stale', () => {
    const mockTrustBundle = {
       badges: [],
       stale_warnings: ['EVD-STALE-001']
    };
    const payload = SurfaceProjector.project('SRF-ANS-003', 'TopicAnswer', mockAnswerBundle, mockTrustBundle, 'low');

    // Variant changes to warning because of stale evidence
    expect(payload.variant).toBe('warning');

    const actionSlot = payload.slots.find((s: any) => s.slot_id.includes('ACT'));
    // stale critical -> buy CTA deactivated / hidden
    expect(actionSlot.data.buy_cta).toBe('secondary_or_hidden');
    expect(actionSlot.data.consult_cta).toBe('primary');
  });
});

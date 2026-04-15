import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { SurfaceProjector } from '@/domain/surface/projector';
import { BrandService } from '@/domain/brand/service';
import { ReadinessCalculator } from '@/domain/brand/readiness-calculator';
import { prisma } from '@/lib/prisma';

describe('Brand Mini B-SSoT (DB Connected)', () => {

  const goodObjects = [
    {
      object_id: 'OBJ-ANS-1',
      object_type: 'AnswerObject',
      canonical_question_id: 'CQ-FIT-1',
      title: 'Is this for me?',
      answer_short: 'Yes',
      fit_summary: {
        recommended_for: ['Dry Skin'],
        not_for: ['Oily Skin']
      }
    },
    {
      object_id: 'OBJ-PRF-1',
      object_type: 'ProofObject',
      canonical_question_id: 'CQ-PROOF-1',
      evidence_grade: 'A',
      reviewer_statements: [{ scope: 'Dermatologist', statement_summary: 'Good' }]
    },
    {
      object_id: 'OBJ-ACT-1',
      object_type: 'ActionObject',
      canonical_question_id: 'CQ-ACTION-1',
      recommended_routes: [
        { target: 'brand_buy_page' },
        { target: 'consult_gate' }
      ]
    }
  ];

  beforeAll(async () => {
    await prisma.kBeautyObject.deleteMany({});
  });

  beforeEach(async () => {
    await BrandService.setMockObjects('BRAND-GOOD', goodObjects);
  });

  it('renders BrandFit properly with both who-its-for and not_for', () => {
    const bundle = { AnswerObject: goodObjects[0] };
    const payload = SurfaceProjector.project('test-fit', 'BrandFit', bundle, {}, 'low');
    
    expect(payload.variant).not.toBe('blocked');
    const fitSlot = payload.slots.find((s: any) => s.slot_type === 'split-panel');
    expect(fitSlot.data.who_its_for).toContain('Dry Skin');
    expect(fitSlot.data.who_its_not_for).toContain('Oily Skin');
  });

  it('blocks BrandFit if not_for is missing (Contract Violation)', () => {
    const badAns = { ...goodObjects[0], fit_summary: { recommended_for: ['Everyone!'] } };
    const bundle = { AnswerObject: badAns };
    
    const payload = SurfaceProjector.project('test-fit-bad', 'BrandFit', bundle, {}, 'low');
    expect(payload.variant).toBe('blocked');
    expect(payload.slots[0].data.limitations[0]).toContain('missing safety constraints');
  });

  it('renders BrandProof with reviewer scope and grade', () => {
    const bundle = { ProofObject: goodObjects[1] };
    const payload = SurfaceProjector.project('test-prf', 'BrandProof', bundle, {}, 'low');
    
    expect(payload.variant).not.toBe('blocked');
    const prfSlot = payload.slots.find((s: any) => s.slot_type === 'block' && s.render_variant === 'detailed');
    expect(prfSlot.data.grade).toBe('A');
    expect(prfSlot.data.reviewers[0]).toContain('Dermatologist');
  });

  it('renders BuyOrConsult properly passing high-risk', () => {
    const bundle = { ActionObject: goodObjects[2] }; 
    const payload = SurfaceProjector.project('test-boc', 'BuyOrConsult', bundle, {}, 'high');
    
    expect(payload.variant).not.toBe('blocked');
    const actSlot = payload.slots.find((s: any) => s.slot_type === 'action-split');
    expect(actSlot.render_variant).toBe('consult_primary'); 
  });

  it('blocks BuyOrConsult if medium/high risk without consult route', () => {
    const badAct = { object_type: 'ActionObject', recommended_routes: [{ target: 'brand_buy_page' }] };
    const bundle = { ActionObject: badAct };
    const payload = SurfaceProjector.project('test-boc-bad', 'BuyOrConsult', bundle, {}, 'high');
    
    expect(payload.variant).toBe('blocked'); 
  });

  it('calculates Brand Readiness score perfectly for a compliant brand', async () => {
    const result = await ReadinessCalculator.calculateBMRIScore('BRAND-GOOD');
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
    expect(result.issues.length).toBe(0);
  });

  it('calculates Brand Readiness with severe penalty for missing not_for and consult', async () => {
    await BrandService.setMockObjects('BRAND-BAD', [
      {
        object_id: 'OBJ-ANS-BAD', object_type: 'AnswerObject', canonical_question_id: 'CQ-FIT-1',
        fit_summary: { recommended_for: ['All'] } 
      },
      {
        object_id: 'OBJ-ACT-BAD', object_type: 'ActionObject', canonical_question_id: 'CQ-ACTION-1',
        recommended_routes: [{ target: 'brand_buy_page' }] 
      }
    ]);
    
    const result = await ReadinessCalculator.calculateBMRIScore('BRAND-BAD');
    expect(result.grade).toBe('F');
    expect(result.score).toBeLessThan(40);
    expect(result.issues).toContain('FIT_MISSING_NOT_FOR: Object OBJ-ANS-BAD missing who-its-not-for');
    expect(result.issues).toContain('MISSING_PROOF_FOR_FIT: Brand has fit claims but no proof attached');
    expect(result.issues).toContain('MISSING_CONSULT_ROUTE: Action OBJ-ACT-BAD lacks fallback consult route');
  });

});

import { describe, it, expect, beforeAll } from 'vitest';
import { BrandPackGenerator } from '@/domain/factory/brand-pack-generator';
import { OverrideManager } from '@/domain/factory/override-manager';
import { prisma } from '@/lib/prisma';

describe('Factory & Template Engine (DB Connected)', () => {

  beforeAll(async () => {
    // Clean up DB for test
    await prisma.kBeautyObject.deleteMany({ where: { brand_id: 'BRAND-Z' } });
    await prisma.brand.deleteMany({ where: { brand_id: 'BRAND-Z' } });
  });

  it('instantiates starter brand pack with default drafts', async () => {
    const results = await BrandPackGenerator.instantiate(['TMPL-ANS-FIT-004'], 'BRAND-Z');
    
    expect(results.length).toBe(1);
    const obj = results[0];
    
    expect(obj.brand_id).toBe('BRAND-Z');
    expect(obj.status).toBe('draft'); 
    expect(obj.payload.canonical_question_id).toBe('CQ-FIT-004'); 
    expect(obj.payload.fit_summary.not_for).toContain('Recent severe irritation');
  });

  it('allows overriding overridable fields and generates diff', async () => {
    const store = await BrandPackGenerator.getStore('BRAND-Z');
    const targetObj = store[0];
    
    const updated = await OverrideManager.applyOverride(targetObj.object_id, {
      'answer_short': 'Yes, Brand Z recommends it.',
      'fit_summary.recommended_for': ['Sensitive Skin', 'Teenagers']
    });

    expect(updated.payload.answer_short).toBe('Yes, Brand Z recommends it.');
    expect(updated.payload.fit_summary.recommended_for).toContain('Teenagers');

    const diff = await OverrideManager.getDiff(targetObj.object_id);
    expect(diff['answer_short'].current).toBe('Yes, Brand Z recommends it.');
    expect(diff['fit_summary'].current.recommended_for).toContain('Teenagers');
  });

  it('blocks overriding invariant fields', async () => {
    const store = await BrandPackGenerator.getStore('BRAND-Z');
    const targetObj = store[0];

    await expect(
      OverrideManager.applyOverride(targetObj.object_id, {
        'canonical_question_id': 'HACKED-CQ-ID'
      })
    ).rejects.toThrowError(/FORBIDDEN_OVERRIDE/);
    
    await expect(
      OverrideManager.applyOverride(targetObj.object_id, {
        'fit_summary.not_for': [] 
      })
    ).rejects.toThrowError(/FORBIDDEN_OVERRIDE/);

    await expect(
      OverrideManager.applyOverride(targetObj.object_id, {
        'fit_summary': { recommended_for: ['all'], not_for: [] }
      })
    ).rejects.toThrowError(/FORBIDDEN_OVERRIDE/);
  });

});

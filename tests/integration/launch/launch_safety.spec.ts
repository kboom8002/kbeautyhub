import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { FeatureFlagManager } from '@/domain/launch/feature-flag';
import { ReleaseGateChecker } from '@/domain/launch/release-gate';
import { RollbackToolkit } from '@/domain/launch/rollback';
import { AuditLogger } from '@/domain/launch/audit-logger';
import { BrandService } from '@/domain/brand/service';
import { prisma } from '@/lib/prisma';

describe('Launch Safety Engine (DB Connected)', () => {

  beforeAll(async () => {
    await prisma.kBeautyObject.deleteMany({});
    await prisma.auditLog.deleteMany({});
  });

  beforeEach(() => {
    FeatureFlagManager.reset();
  });

  it('evaluates global and scoped feature flags correctly', () => {
    expect(FeatureFlagManager.evaluate('ff_consult_gate')).toBe(true); 
    FeatureFlagManager.setScopedFlag('brand_Z', 'ff_consult_gate', false);
    expect(FeatureFlagManager.evaluate('ff_consult_gate', { brand_id: 'Z' })).toBe(false);
    expect(FeatureFlagManager.evaluate('ff_consult_gate', { brand_id: 'X' })).toBe(true);
  });

  it('fails release gate when dead-end is present', async () => {
    await BrandService.setMockObjects('BRAND-DEAD-END', [
      {
        object_id: 'OBJ-ANS-1',
        object_type: 'AnswerObject',
        fit_summary: { caution_for: ['High Risk'] }
      }
    ]);

    const report = await ReleaseGateChecker.checkReadiness('BRAND-DEAD-END');
    expect(report.passed).toBe(false);
    expect(report.violations.some(v => v.includes('DEAD_END_VIOLATION'))).toBe(true);
  });

  it('fails release gate when stale critical exposure is > 0', async () => {
    await BrandService.setMockObjects('BRAND-STALE-EXPOSURE', [
      {
        object_id: 'OBJ-ANS-1',
        object_type: 'AnswerObject',
        fit_summary: { caution_for: ['High Risk'] },
        _stale_critical: true 
      },
      {
        object_id: 'OBJ-ACT-1', object_type: 'ActionObject', recommended_routes: [{ target: 'consult_gate' }]
      },
      {
        object_id: 'OBJ-PRF-1', object_type: 'ProofObject'
      }
    ]);

    const report = await ReleaseGateChecker.checkReadiness('BRAND-STALE-EXPOSURE');
    expect(report.passed).toBe(false);
    expect(report.violations.some(v => v.includes('STALE_CRITICAL_EXPOSURE'))).toBe(true);
  });

  it('fails release gate when high-risk boundary is missing', async () => {
    await BrandService.setMockObjects('BRAND-NO-BOUNDARY', [
      {
        object_id: 'OBJ-ANS-1',
        object_type: 'AnswerObject',
        fit_summary: { caution_for: ['High Risk'] }
      },
      {
        object_id: 'OBJ-ACT-1', object_type: 'ActionObject', recommended_routes: [{ target: 'consult_gate' }]
      },
      {
        object_id: 'OBJ-PRF-1', object_type: 'ProofObject' 
      }
    ]);

    const report = await ReleaseGateChecker.checkReadiness('BRAND-NO-BOUNDARY');
    expect(report.passed).toBe(false);
    expect(report.violations.some(v => v.includes('BOUNDARY_MISSING'))).toBe(true);
  });

  it('passes release gate when all conditions are met', async () => {
    await BrandService.setMockObjects('BRAND-SAFE', [
      {
        object_id: 'OBJ-ANS-1',
        object_type: 'AnswerObject',
        fit_summary: { caution_for: ['High Risk'], recommended_for: ['A'], not_for: ['B'] },
      },
      {
        object_id: 'OBJ-ACT-1', object_type: 'ActionObject', recommended_routes: [{ target: 'consult_gate' }]
      },
      {
        object_id: 'OBJ-PRF-1', object_type: 'ProofObject' 
      },
      {
        object_id: 'OBJ-BND-1', object_type: 'BoundaryObject' 
      }
    ]);

    const report = await ReleaseGateChecker.checkReadiness('BRAND-SAFE');
    expect(report.passed).toBe(true);
    expect(report.violations.length).toBe(0);
  });

  it('executes Consult-Safe Rollback properly', async () => {
    const brand_id = 'BRAND-DANGER';
    
    expect(FeatureFlagManager.evaluate('ff_brand_buy_cta', { brand_id })).toBe(true);
    expect(FeatureFlagManager.evaluate('ff_consult_first', { brand_id })).toBe(false);

    await RollbackToolkit.executeConsultSafeRollback(brand_id, "Found critical irritation risk", "ADMIN_1");

    expect(FeatureFlagManager.evaluate('ff_brand_buy_cta', { brand_id })).toBe(false);
    expect(FeatureFlagManager.evaluate('ff_consult_first', { brand_id })).toBe(true);

    const logs = await AuditLogger.getLogs();
    const lastLog = logs[0]; // descending order by timestamp
    expect(lastLog.action).toBe('ROLLBACK');
    expect(lastLog.reason).toBe("Found critical irritation risk");
    expect(lastLog.target_brand_id).toBe(brand_id);
  });

});

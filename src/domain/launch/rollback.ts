import { FeatureFlagManager } from './feature-flag';
import { AuditLogger } from './audit-logger';

export class RollbackToolkit {
  
  static async executeConsultSafeRollback(brand_id: string, reason: string, admin_id: string) {
    if (!brand_id) throw new Error("A specific target is required for scoped rollback.");

    const scopeKey = `brand_${brand_id}`;

    // 1. Force kill the Commerce/Buy CTA
    FeatureFlagManager.setScopedFlag(scopeKey, 'ff_brand_buy_cta', false);
    
    // 2. Force prioritize Consult routes globally for this brand
    FeatureFlagManager.setScopedFlag(scopeKey, 'ff_consult_first', true);

    // 3. Record Audit
    const log = await AuditLogger.log('ROLLBACK', reason, admin_id, brand_id);

    return {
      success: true,
      message: `Consult-Safe Rollback applied to brand ${brand_id}. Commerce disabled.`,
      log
    };
  }

}

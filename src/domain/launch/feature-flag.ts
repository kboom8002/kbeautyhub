export type FlagScope = {
  brand_id?: string;
  topic?: string;
  tenant_id?: string;
};

export class FeatureFlagManager {
  // Global defaults
  private static flags: Record<string, boolean> = {
    ff_runtime_search_entry: true,
    ff_brand_start_page: true,
    ff_consult_gate: true,
    ff_brand_buy_cta: true, // Specific abstraction for enabling buy buttons
    ff_consult_first: false // Forces consult route
  };

  // Scoped overrides
  private static scopedFlags: Record<string, Record<string, boolean>> = {};

  static evaluate(flag_name: string, scope?: FlagScope): boolean {
    if (scope?.brand_id) {
      const brandKey = `brand_${scope.brand_id}`;
      if (this.scopedFlags[brandKey]?.[flag_name] !== undefined) {
        return this.scopedFlags[brandKey][flag_name];
      }
    }
    return this.flags[flag_name] ?? false; 
  }

  static setGlobalFlag(flag_name: string, value: boolean) {
    this.flags[flag_name] = value;
  }

  static setScopedFlag(scope_key: string, flag_name: string, value: boolean) {
    if (!this.scopedFlags[scope_key]) {
      this.scopedFlags[scope_key] = {};
    }
    this.scopedFlags[scope_key][flag_name] = value;
  }

  static reset() {
    this.scopedFlags = {};
  }
}

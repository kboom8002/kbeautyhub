export class ReviewerValidator {
  /**
   * Evaluates if a reviewer scope is valid for a given action.
   */
  static isValid(scope: any, requiredRisk: string, targetClaimType: string): boolean {
    if (!scope) return false;

    // 1. Check expiration
    if (scope.valid_to && new Date() > new Date(scope.valid_to)) {
      return false; // Stale scope
    }

    // 2. Check risk ceiling
    const riskRanks: Record<string, number> = { low: 1, medium: 2, high: 3 };
    const requiredRank = riskRanks[requiredRisk] || 1;
    const ceilingRank = riskRanks[scope.risk_ceiling] || 1;

    if (requiredRank > ceilingRank) {
      return false; // Exceeds authorized risk level
    }

    // 3. Check claim types
    if (scope.claim_types && !scope.claim_types.includes(targetClaimType)) {
      return false; // Cannot review this claim type
    }

    return true;
  }
}

export class StaleEvaluator {
  /**
   * Evaluates if an evidence object is currently stale.
   */
  static isStale(evidence: any): boolean {
    if (!evidence.last_validated_at) return true;

    const policies = evidence.freshness_policy;
    if (!policies || !policies.stale_after_days) return false;

    const lastValidatedDate = new Date(evidence.last_validated_at);
    const msInDay = 24 * 60 * 60 * 1000;
    const daysSinceValid = (Date.now() - lastValidatedDate.getTime()) / msInDay;

    return daysSinceValid > policies.stale_after_days;
  }
}

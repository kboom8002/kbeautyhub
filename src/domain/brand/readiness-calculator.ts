import { BrandService } from './service';

export class ReadinessCalculator {
  
  static async calculateBMRIScore(brand_id: string): Promise<{ score: number, grade: string, issues: string[] }> {
    const objects = await BrandService.getTestScopedObjects(brand_id);
    let score = 100;
    const issues: string[] = [];

    // Rule 1: Fit criteria must have 'not_for'
    const fitObjects = objects.filter((o: any) => o.canonical_question_id?.startsWith('CQ-FIT')) as any[];
    let fitFailed = false;
    for (const fit of fitObjects) {
      if (!fit.fit_summary?.not_for || fit.fit_summary.not_for.length === 0) {
        issues.push(`FIT_MISSING_NOT_FOR: Object ${fit.object_id} missing who-its-not-for`);
        score -= 30; // severe penalty
        fitFailed = true;
      }
    }

    // Rule 2: Proof must exist if Fit exists
    const proofObjects = objects.filter((o: any) => o.canonical_question_id?.startsWith('CQ-PROOF'));
    if (fitObjects.length > 0 && proofObjects.length === 0) {
      issues.push(`MISSING_PROOF_FOR_FIT: Brand has fit claims but no proof attached`);
      score -= 20;
    }

    // Rule 3: High risk cases must have Consult options in actions
    const actionObjects = objects.filter((o: any) => o.object_type === 'ActionObject') as any[];
    for (const act of actionObjects) {
      // In MVP, we just check if "consult_gate" exists in targets anywhere.
      const hasConsult = act.recommended_routes?.some((r: any) => r.target === 'consult_gate');
      if (!hasConsult) {
        issues.push(`MISSING_CONSULT_ROUTE: Action ${act.object_id} lacks fallback consult route`);
        score -= 25;
      }
    }

    // Grade calculation
    let grade = 'F';
    if (score >= 85) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 55) grade = 'C';
    else if (score >= 40) grade = 'D';

    return { score, grade, issues };
  }
}

import { BrandService } from '@/domain/brand/service';
import { SurfaceProjector } from '@/domain/surface/projector';

export type GateReport = {
  passed: boolean;
  brand_id: string;
  violations: string[];
};

export class ReleaseGateChecker {

  static async checkReadiness(brand_id: string): Promise<GateReport> {
    const objects = await BrandService.getTestScopedObjects(brand_id) as any[];
    const violations: string[] = [];

    // Check 1: Trust Bundle Completeness & No Dead End Compliance
    let hasDeadEnd = false;
    let missingTrust = false;
    let missingBoundary = false;
    
    // Check 2: Stale critical exposure (Mock simulation: Check if any object has a 'stale' flag pseudo property)
    let staleCriticalExposure = 0;

    for (const obj of objects) {
      if (obj.object_type === 'AnswerObject') {
        const isHighRisk = obj.fit_summary?.caution_for?.length > 0;
        
        // Mocking stale check for test
        if ((obj as any)._stale_critical) {
           staleCriticalExposure++;
        }

        // Check Dead End: Does Answer rely on Action/Consult?
        // Since MVP objects are mocked, we check if overall ActionObject exists
        const act = objects.find((o: any) => o.object_type === 'ActionObject');
        if (!act || !act.recommended_routes || act.recommended_routes.length === 0) {
          hasDeadEnd = true;
        }

        // Check Trust: If high risk, must have Proof associated
        const prf = objects.find((o: any) => o.object_type === 'ProofObject');
        if (isHighRisk && !prf) {
          missingTrust = true;
        }

        // Check Boundary: If high risk, must have Boundary associated
        const bnd = objects.find((o: any) => o.object_type === 'BoundaryObject');
        if (isHighRisk && !bnd) {
          missingBoundary = true;
        }
      }
    }

    if (staleCriticalExposure > 0) violations.push(`STALE_CRITICAL_EXPOSURE: Found ${staleCriticalExposure} unresolved stale flags on high-risk objects.`);
    if (hasDeadEnd) violations.push(`DEAD_END_VIOLATION: No safe routing (consult or buy) found.`);
    if (missingTrust) violations.push(`TRUST_INCOMPLETE: High-risk topics missing required proof objects.`);
    if (missingBoundary) violations.push(`BOUNDARY_MISSING: High-risk topics MUST have at least one boundary object.`);

    // Check 3: Required Slot Render Success
    try {
      const bundle = {
        AnswerObject: objects.find((o: any) => o.object_type === 'AnswerObject'),
        ActionObject: objects.find((o: any) => o.object_type === 'ActionObject')
      };
      
      const testProjectPayload = SurfaceProjector.project(
        `TEST-BSSOT`,
        "BrandFit",
        bundle,
        {},
        "medium"
      );
      if (testProjectPayload.variant === 'blocked') {
         violations.push(`RENDER_FAIL: SurfaceProjector blocked rendering due to missing slots.`);
      }
    } catch (e: any) {
      violations.push(`RENDER_CRASH: ${e.message}`);
    }

    return {
      passed: violations.length === 0,
      brand_id,
      violations
    };
  }
}

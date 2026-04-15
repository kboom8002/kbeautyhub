import { v4 as uuidv4 } from "uuid";
import { buildTopicAnswer, buildCompare, buildRoutine, buildBoundarySurface, buildBrandStart, buildBrandFit, buildBrandProof, buildBuyOrConsult } from "./builders";
import { buildActionModule, buildBoundaryBlock } from "./shared";

export class SurfaceProjector {
  
  static project(surfaceId: string, surfaceType: string, objectBundle: any, trustBundle: any = {}, riskLevel: string = "low"): any {
    const projectionId = `PROJ-${uuidv4().slice(0, 8)}`;
    
    try {
      let slots = [];
      const isHighRisk = riskLevel === "high";

      switch (surfaceType) {
        case "TopicAnswer":
          if (!objectBundle.AnswerObject) throw new Error("MISSING_REQUIRED_OBJECT");
          slots = buildTopicAnswer(objectBundle, trustBundle, riskLevel);
          break;
        case "Compare":
          if (!objectBundle.CompareObject) throw new Error("MISSING_REQUIRED_OBJECT");
          slots = buildCompare(objectBundle, trustBundle, riskLevel);
          break;
        case "Routine":
          slots = buildRoutine(objectBundle, trustBundle, riskLevel);
          break;
        case "Boundary":
          slots = buildBoundarySurface(objectBundle, trustBundle, riskLevel);
          break;
        case "BrandStart":
          if (!objectBundle.AnswerObject) throw new Error("MISSING_REQUIRED_OBJECT");
          slots = buildBrandStart(objectBundle, trustBundle, riskLevel);
          break;
        case "BrandFit":
          if (!objectBundle.AnswerObject) throw new Error("MISSING_REQUIRED_OBJECT");
          slots = buildBrandFit(objectBundle, trustBundle, riskLevel);
          break;
        case "BrandProof":
          if (!objectBundle.ProofObject) throw new Error("MISSING_REQUIRED_OBJECT");
          slots = buildBrandProof(objectBundle, trustBundle, riskLevel);
          break;
        case "BuyOrConsult":
          if (!objectBundle.ActionObject) throw new Error("MISSING_REQUIRED_OBJECT");
          slots = buildBuyOrConsult(objectBundle, trustBundle, riskLevel);
          break;
        default:
          throw new Error("UNKNOWN_SURFACE_TYPE");
      }

      // Check required slots enforcement
      const missingRequired = slots.some(slot => slot.required && !slot.visible);
      if (missingRequired) {
        throw new Error("MISSING_REQUIRED_SLOT");
      }

      // Check overarching stale policy enforcement
      const isStale = trustBundle?.stale_warnings?.length > 0;

      return {
        projection_id: projectionId,
        surface_id: surfaceId,
        variant: isStale ? "warning" : (isHighRisk ? "consult_first" : "default"),
        slots: slots
      };

    } catch (e: any) {
      // Fallback Blocked Payload (graceful crash shield)
      return {
         projection_id: projectionId,
         surface_id: surfaceId,
         variant: "blocked",
         slots: [
           { 
             slot_id: "ERR-BND", slot_type: "block", required: true, visible: true, render_variant: "warning", fallback_variant: null,
             data: { title: "Content Unavailable", limitations: ["This content is temporarily blocked due to missing safety constraints."] }
           },
           buildActionModule({}, trustBundle, "high") // Provide safe escape routes
         ]
      };
    }
  }
}

import { v4 as uuidv4 } from "uuid";

export const buildTrustBlock = (objects: any, trustBundle: any, riskLevel: string) => {
  const proofObjects = objects.ProofObject || [];
  
  return {
    slot_id: `SLOT-TRUST-${uuidv4().slice(0, 8)}`,
    slot_type: "block",
    required: true,
    visible: true,
    render_variant: riskLevel === "high" ? "warning" : "default",
    fallback_variant: null,
    data: {
      title: "Trust & Evidence",
      proof_count: Array.isArray(proofObjects) ? proofObjects.length : (proofObjects.object_id ? 1 : 0),
      badges: trustBundle?.badges || [],
      stale_warning: trustBundle?.stale_warnings?.length > 0
    }
  };
};

export const buildBoundaryBlock = (objects: any, riskLevel: string) => {
  const boundaryObjects = objects.BoundaryObject || [];
  const isHighRisk = riskLevel === "high";

  return {
    slot_id: `SLOT-BND-${uuidv4().slice(0, 8)}`,
    slot_type: "block",
    required: isHighRisk,
    visible: isHighRisk || boundaryObjects.length > 0,
    render_variant: isHighRisk ? "early_placement_warning" : "default",
    fallback_variant: null,
    data: {
      title: "Cautions & Boundaries",
      limitations: boundaryObjects.length > 0 ? (boundaryObjects[0]?.caution_cases || ["See Context"]) : []
    }
  };
};

export const buildActionModule = (objects: any, trustBundle: any, riskLevel: string) => {
  const isHighRisk = riskLevel === "high";
  const isStale = trustBundle?.stale_warnings?.length > 0;

  // Enforce High Risk CTA Policy & Stale Evidence blocks Buy CTA
  return {
    slot_id: `SLOT-ACT-${uuidv4().slice(0, 8)}`,
    slot_type: "block",
    required: true,
    visible: true,
    render_variant: (isHighRisk || isStale) ? "consult_primary" : "shopping_primary",
    fallback_variant: null,
    data: {
      buy_cta: (isHighRisk || isStale) ? "secondary_or_hidden" : "primary",
      consult_cta: (isHighRisk || isStale) ? "primary" : "secondary"
    }
  };
};

export const buildNextQuestionRail = () => {
  return {
    slot_id: `SLOT-NEXT-${uuidv4().slice(0, 8)}`,
    slot_type: "rail",
    required: false,
    visible: true,
    render_variant: "default",
    fallback_variant: null,
    data: {
      recommendations: ["See further routines", "Read safe alternatives"]
    }
  };
};

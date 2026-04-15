import { v4 as uuidv4 } from "uuid";
import { buildTrustBlock, buildBoundaryBlock, buildActionModule, buildNextQuestionRail } from "./shared";

export const buildTopicAnswer = (bundle: any, trustBundle: any, riskLevel: string) => {
  const ans = bundle.AnswerObject;
  
  const slots = [];

  slots.push({
    slot_id: `SLOT-HERO-${uuidv4().slice(0,4)}`,
    slot_type: "hero",
    required: true,
    visible: true,
    render_variant: "default",
    fallback_variant: null,
    data: { title: ans?.title || "Answer", short: ans?.answer_short || "See details" }
  });

  const boundary = buildBoundaryBlock(bundle, riskLevel);
  if (riskLevel === "high") slots.push(boundary);

  slots.push({
    slot_id: `SLOT-BODY-${uuidv4().slice(0,4)}`,
    slot_type: "block",
    required: true,
    visible: true,
    render_variant: "expanded",
    fallback_variant: null,
    data: { body: ans?.answer_full || "Detail text" }
  });

  if (riskLevel !== "high") slots.push(boundary);

  slots.push(buildTrustBlock(bundle, trustBundle, riskLevel));
  slots.push(buildActionModule(bundle, trustBundle, riskLevel));
  slots.push(buildNextQuestionRail());

  return slots;
};

export const buildCompare = (bundle: any, trustBundle: any, riskLevel: string) => {
  const comp = bundle.CompareObject || {};
  const slots = [];

  slots.push({
    slot_id: `SLOT-COMP-${uuidv4().slice(0,4)}`,
    slot_type: "block",
    required: true,
    visible: true,
    render_variant: "matrix",
    fallback_variant: null,
    data: { 
      matrix: comp.comparison_matrix || {},
      fit_by_case: comp.fit_by_case || ["Missing Fit Info"] 
    }
  });

  slots.push(buildBoundaryBlock(bundle, riskLevel));
  slots.push(buildTrustBlock(bundle, trustBundle, riskLevel));
  slots.push(buildActionModule(bundle, trustBundle, riskLevel));

  return slots;
};

export const buildRoutine = (bundle: any, trustBundle: any, riskLevel: string) => {
  const action = bundle.ActionObject || {};
  const slots = [];
  slots.push({
    slot_id: `SLOT-ROUTINE-${uuidv4().slice(0,4)}`,
    slot_type: "block",
    required: true,
    visible: true,
    render_variant: "stepper",
    fallback_variant: null,
    data: { steps: action.routing_logic || ["See steps"] }
  });
  slots.push(buildBoundaryBlock(bundle, riskLevel));
  slots.push(buildActionModule(bundle, trustBundle, riskLevel));
  return slots;
};

export const buildBoundarySurface = (bundle: any, trustBundle: any, riskLevel: string) => {
  const boundary = bundle.BoundaryObject || {};
  const slots = [];
  slots.push({
    slot_id: `SLOT-SAFTEY-${uuidv4().slice(0,4)}`,
    slot_type: "hero",
    required: true,
    visible: true,
    render_variant: "warning",
    fallback_variant: null,
    data: { 
      safety_intro: boundary.title || "Caution Required",
      safer_alternatives: boundary.safer_routing_options || ["Ask an expert"]
    }
  });
  slots.push(buildActionModule(bundle, trustBundle, riskLevel));
  return slots;
};

export const buildBrandStart = (bundle: any, trustBundle: any, riskLevel: string) => {
  const ans = bundle.AnswerObject;
  const slots = [];
  
  const boundary = buildBoundaryBlock(bundle, riskLevel);
  if (riskLevel === "high") slots.push(boundary); // early placement constraint

  // Constraint: Question-first entry, not marketing hero
  slots.push({
    slot_id: `SLOT-Q-ENTRY-${uuidv4().slice(0,4)}`,
    slot_type: "question",
    required: true,
    visible: true,
    render_variant: "large",
    fallback_variant: null,
    data: { question: ans?.title || "What is this for?" }
  });
  
  slots.push({
    slot_id: `SLOT-ANS-HERO-${uuidv4().slice(0,4)}`,
    slot_type: "hero",
    required: true,
    visible: true,
    render_variant: "default",
    fallback_variant: null,
    data: { short: ans?.answer_short || "See details" }
  });

  if (riskLevel !== "high") slots.push(boundary);
  slots.push(buildActionModule(bundle, trustBundle, riskLevel));
  return slots;
};

export const buildBrandFit = (bundle: any, trustBundle: any, riskLevel: string) => {
  const ans = bundle.AnswerObject;
  const fitInfo = ans?.fit_summary || {};
  
  // Constraint Check: who-its-for and not-for MUST BOTH EXIST
  if (!fitInfo.recommended_for || fitInfo.recommended_for.length === 0 || 
      !fitInfo.not_for || fitInfo.not_for.length === 0) {
    throw new Error("CONTRACT_VIOLATION: who-its-for and not_for MUST both be present.");
  }

  const slots = [];
  
  const boundary = buildBoundaryBlock(bundle, riskLevel);
  if (riskLevel === "high") slots.push(boundary);

  slots.push({
    slot_id: `SLOT-FIT-${uuidv4().slice(0,4)}`,
    slot_type: "split-panel",
    required: true,
    visible: true,
    render_variant: "default",
    fallback_variant: null,
    data: {
      who_its_for: fitInfo.recommended_for,
      who_its_not_for: fitInfo.not_for,
      caution: fitInfo.caution_for || []
    }
  });

  if (riskLevel !== "high") slots.push(boundary);
  slots.push(buildTrustBlock(bundle, trustBundle, riskLevel));
  slots.push(buildActionModule(bundle, trustBundle, riskLevel));
  return slots;
};

export const buildBrandProof = (bundle: any, trustBundle: any, riskLevel: string) => {
  const prf = bundle.ProofObject;
  const slots = [];
  slots.push({
    slot_id: `SLOT-PROOF-${uuidv4().slice(0,4)}`,
    slot_type: "block",
    required: true,
    visible: !!prf,
    render_variant: "detailed",
    fallback_variant: null,
    data: {
      grade: prf?.evidence_grade || "Unknown",
      reviewers: prf?.reviewer_statements?.map((r: any) => `${r.scope}: ${r.statement_summary}`) || []
    }
  });
  return slots;
};

export const buildBuyOrConsult = (bundle: any, trustBundle: any, riskLevel: string) => {
  const act = bundle.ActionObject;
  
  const hasConsult = act?.recommended_routes?.some((r: any) => r.target === 'consult_gate');

  // Constraint Check: High Risk MUST have consult route
  if (riskLevel !== "low" && !hasConsult) {
    throw new Error("CONTRACT_VIOLATION: medium/high risk MUST have a consult route.");
  }

  const slots = [];
  slots.push({
    slot_id: `SLOT-BOC-${uuidv4().slice(0,4)}`,
    slot_type: "action-split",
    required: true,
    visible: true,
    render_variant: riskLevel === "high" ? "consult_primary" : "commerce_primary",
    fallback_variant: null,
    data: {
      routes: act?.recommended_routes || []
    }
  });
  return slots;
};

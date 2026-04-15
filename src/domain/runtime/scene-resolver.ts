import { createAdminClient } from "@/lib/supabase";
import { CanonicalMappingResult } from "./canonical-mapper";

export type SceneResolveResult = {
  canonical_question_id: string;
  scene_id: string;
  confidence: number;
  risk_level: string;
  surface_recommendation?: string;
  fallback_scene_ids?: string[];
};

export class SceneResolver {
  /**
   * Translates mapped Canonical Question candidates into specific QIS Scenes.
   */
  static async resolve(candidates: CanonicalMappingResult[]): Promise<SceneResolveResult> {
    if (!candidates || candidates.length === 0) {
      throw new Error("NO_CANDIDATE_MATCHED");
    }

    const supabase = createAdminClient();

    // Use the top candidate
    const topMatch = candidates[0];
    
    // Determine risk level of that CQ
    let riskLevel = "low";
    const { data: cq } = await supabase.from("canonical_question").select("risk_level").eq("canonical_question_id", topMatch.canonical_question_id).single();
    if (cq && cq.risk_level) riskLevel = cq.risk_level;

    // Fetch associated Scenes
    const { data: scenes } = await supabase.from("qis_scene")
       .select("*")
       .eq("canonical_question_id", topMatch.canonical_question_id)
       .eq("status", "ACTIVE");

    let targetSceneId = "QIS-FALLBACK-000";
    if (scenes && scenes.length > 0) {
      targetSceneId = scenes[0].scene_id;
    }

    const result: SceneResolveResult = {
      canonical_question_id: topMatch.canonical_question_id,
      scene_id: targetSceneId,
      confidence: topMatch.confidence,
      risk_level: riskLevel
    };

    // --- GUARDRAIL: High-risk Ambiguity Fallback ---
    // If risk is high and the mapping had low confidence/ambiguity, provide a safer fallback scene.
    if (riskLevel === "high" && topMatch.ambiguity) {
      // In production, fetch predefined consult_first_default_scenes from Risk Policy Seed.
      result.fallback_scene_ids = ["QIS-KBS-CONSULT-GATE"];
      result.surface_recommendation = "consult_first";
    }

    // Force fallback for GP testing purposes if confidence is low
    if (topMatch.confidence < 0.5) {
      result.fallback_scene_ids = ["QIS-KBS-BROWSE"];
    }

    return result;
  }
}

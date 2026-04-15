import { createAdminClient } from "@/lib/supabase";

export class ObjectBundleComposer {
  /**
   * Composes a bundle for a specific scene and checks truth boundaries.
   */
  static async compose(scene_id: string) {
    const supabase = createAdminClient();

    // 1. Fetch the Target Scene
    const { data: scene, error: sceneErr } = await supabase
      .from("qis_scene")
      .select("*")
      .eq("scene_id", scene_id)
      .single();

    if (sceneErr || !scene) {
      throw new Error("SCENE_NOT_FOUND");
    }

    // 2. Fetch Master Objects linked to this Canonical Question
    // In a real resolved query, we'd fetch specific objects based on tenant or variants.
    // For MVP, fetch published/draft objects matching the CQ.
    const { data: objects, error: objErr } = await supabase
      .from("object_master")
      .select("*")
      .eq("canonical_question_id", scene.canonical_question_id);

    if (objErr) throw new Error("FETCH_OBJECTS_ERROR");

    // 3. Assemble components based on required_objects
    const bundle: Record<string, any> = {};
    const missingTypes: string[] = [];
    const foundTypes: string[] = [];

    for (const reqType of scene.required_objects) {
      const match = objects.find((o: any) => o.object_type === reqType);
      if (match) {
        bundle[reqType] = match;
        foundTypes.push(reqType);
      } else {
        missingTypes.push(reqType);
      }
    }

    // 4. Enforce High-Risk Guardrail
    if (scene.risk_level === 'high') {
      const hasBoundary = foundTypes.includes('BoundaryObject');
      if (!hasBoundary) {
        throw new Error("INVALID_BUNDLE_HIGH_RISK_MISSING_BOUNDARY");
      }
    }

    return {
      scene_id: scene.scene_id,
      bundle,
      missingTypes,
      status: missingTypes.length === 0 ? "COMPLETE" : "INCOMPLETE",
      risk_level: scene.risk_level
    };
  }
}

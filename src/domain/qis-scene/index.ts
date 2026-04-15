import { z } from "zod";
import { createAdminClient } from "@/lib/supabase";

export const QISSceneSchema = z.object({
  scene_id: z.string().min(1),
  canonical_question_id: z.string().optional(),
  scene_title: z.string().optional(),
  representative_query: z.string().min(1),
  intent: z.string().optional(),
  scenario: z.string().optional(),
  persona_origin: z.string().optional(),
  decision_stage: z.string().optional(),
  risk_level: z.string().optional(),
  trust_requirement: z.string().optional(),
  required_objects: z.array(z.string()).min(1),
  bundle_id: z.string().optional(),
  surface_targets: z.array(z.string()).optional(),
  primary_success_metric: z.string().optional(),
  nudge_rule: z.string().optional(),
  bridge_rule: z.string().optional(),
  handoff_rule: z.string().optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE"),
}).refine(data => {
  if (data.risk_level === 'high') {
    return data.required_objects.includes('BoundaryObject');
  }
  return true;
}, { message: "HIGH_RISK_REQUIRES_BOUNDARY" });

export type QISSceneInput = z.infer<typeof QISSceneSchema>;

export class QISSceneService {
  static async upsert(data: QISSceneInput) {
    const parsed = QISSceneSchema.parse(data);
    const supabase = createAdminClient();
    
    const { data: result, error } = await supabase
      .from("qis_scene")
      .upsert([parsed], { onConflict: 'scene_id' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  }

  static async list() {
    const supabase = createAdminClient();
    const { data: result, error } = await supabase
      .from("qis_scene")
      .select("*")
      .eq("status", "ACTIVE");
      
    if (error) throw new Error(error.message);
    return result;
  }
}

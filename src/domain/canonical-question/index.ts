import { z } from "zod";
import { createAdminClient } from "@/lib/supabase";

export const CanonicalQuestionSchema = z.object({
  canonical_question_id: z.string().min(1),
  vertical_id: z.string().min(1),
  family_code: z.enum(["QC-01", "QC-02", "QC-03", "QC-04", "QC-05", "QC-06", "QC-07", "QC-08", "QC-09", "QC-10"]),
  title: z.string().min(1),
  signature: z.string().min(1),
  primary_object_type: z.string().min(1),
  secondary_object_types: z.array(z.string()).optional(),
  layer: z.enum(["A", "B", "C"]).optional(),
  priority: z.number().int().optional(),
  risk_level: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE"),
}).refine(data => {
  if (data.risk_level === 'high') {
    const hasBoundary = data.primary_object_type === 'BoundaryObject' || 
                        data.secondary_object_types?.includes('BoundaryObject');
    return hasBoundary;
  }
  return true;
}, { message: "HIGH_RISK_REQUIRES_BOUNDARY" })
.refine(data => {
  if (data.family_code === 'QC-08') {
    return data.primary_object_type === 'BoundaryObject';
  }
  return true;
}, { message: "QC-08_MUST_BE_BOUNDARY" });

export type CanonicalQuestionInput = z.infer<typeof CanonicalQuestionSchema>;

export class CanonicalQuestionService {
  static async upsert(data: CanonicalQuestionInput) {
    const parsed = CanonicalQuestionSchema.parse(data);
    const supabase = createAdminClient();
    
    const { data: result, error } = await supabase
      .from("canonical_question")
      .upsert([parsed], { onConflict: 'canonical_question_id' })
      .select()
      .single();

    if (error) {
      if (error.code === '23505' && error.message.includes('signature')) {
        throw new Error("CQ_SIGNATURE_DUPLICATE");
      }
      throw new Error(error.message);
    }
    return result;
  }

  static async list() {
    const supabase = createAdminClient();
    const { data: result, error } = await supabase
      .from("canonical_question")
      .select("*")
      .eq("status", "ACTIVE");
      
    if (error) throw new Error(error.message);
    return result;
  }
}

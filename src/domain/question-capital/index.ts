import { z } from "zod";
import { createAdminClient } from "@/lib/supabase";

export const QuestionCapitalSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE"),
});

export type QuestionCapitalInput = z.infer<typeof QuestionCapitalSchema>;

export class QuestionCapitalService {
  static async upsert(data: QuestionCapitalInput) {
    const parsed = QuestionCapitalSchema.parse(data);
    const supabase = createAdminClient();
    
    const { data: result, error } = await supabase
      .from("question_capital")
      .upsert([parsed], { onConflict: 'code' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  }

  static async list() {
    const supabase = createAdminClient();
    const { data: result, error } = await supabase
      .from("question_capital")
      .select("*")
      .eq("status", "ACTIVE");
      
    if (error) throw new Error(error.message);
    return result;
  }
}

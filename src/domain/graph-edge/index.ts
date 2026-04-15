import { z } from "zod";
import { createAdminClient } from "@/lib/supabase";

export const GraphEdgeSchema = z.object({
  edge_id: z.string().min(1),
  source_node_type: z.string().min(1),
  source_node_id: z.string().min(1),
  target_node_type: z.string().min(1),
  target_node_id: z.string().min(1),
  edge_type: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE"),
});

export type GraphEdgeInput = z.infer<typeof GraphEdgeSchema>;

export class GraphEdgeService {
  static async upsert(data: GraphEdgeInput) {
    const parsed = GraphEdgeSchema.parse(data);
    
    if (parsed.source_node_id === parsed.target_node_id) {
      throw new Error("GRAPH_EDGE_SELF_LOOP_INVALID");
    }

    const supabase = createAdminClient();
    
    const { data: result, error } = await supabase
      .from("graph_edge")
      .upsert([parsed], { onConflict: 'edge_id' })
      .select()
      .single();

    if (error) {
      if (error.code === '23514' && error.message.includes('check_no_self_loop')) {
         throw new Error("GRAPH_EDGE_SELF_LOOP_INVALID");
      }
      throw new Error(error.message);
    }
    return result;
  }

  static async list() {
    const supabase = createAdminClient();
    const { data: result, error } = await supabase
      .from("graph_edge")
      .select("*")
      .eq("status", "ACTIVE");
      
    if (error) throw new Error(error.message);
    return result;
  }
}

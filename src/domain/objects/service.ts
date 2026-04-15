import { createAdminClient } from "@/lib/supabase";
import { GraphEdgeService } from "@/domain/graph-edge";
import { 
  ObjectMasterSchema, 
  AnswerObjectSubtypeSchema,
  CompareObjectSubtypeSchema,
  ProofObjectSubtypeSchema,
  BoundaryObjectSubtypeSchema,
  ActionObjectSubtypeSchema
} from "./schemas";

export class ObjectService {
  static async upsert(payload: any) {
    const supabase = createAdminClient();

    // 1. Parse Master
    const masterData = ObjectMasterSchema.parse({
      object_id: payload.object_id,
      object_type: payload.object_type,
      canonical_question_id: payload.canonical_question_id,
      title: payload.title,
      status: payload.status,
    });

    let subtypeData: any = {};
    let finalStatus = masterData.status;

    // 2. Parse Subtype and Handle validations
    switch (masterData.object_type) {
      case "AnswerObject":
        subtypeData = AnswerObjectSubtypeSchema.parse(payload);
        break;
      case "CompareObject":
        subtypeData = CompareObjectSubtypeSchema.parse(payload);
        // Apply Fallback Status Rule
        if (subtypeData._fallbackStatus) {
          finalStatus = subtypeData._fallbackStatus;
        }
        delete subtypeData._fallbackStatus;
        break;
      case "ProofObject":
        subtypeData = ProofObjectSubtypeSchema.parse(payload);
        break;
      case "BoundaryObject":
        subtypeData = BoundaryObjectSubtypeSchema.parse(payload);
        break;
      case "ActionObject":
        subtypeData = ActionObjectSubtypeSchema.parse(payload);
        break;
      default:
        throw new Error("Unknown object_type");
    }

    masterData.status = finalStatus;

    // 3. Persist Master
    const { error: masterErr } = await supabase
      .from("object_master")
      .upsert([masterData], { onConflict: "object_id" });
    if (masterErr) throw new Error("Master Error: " + masterErr.message);

    // 4. Persist Subtype
    const subtypeTableName = `object_${masterData.object_type.toLowerCase().replace('object', '')}`;
    const { error: subtypeErr } = await supabase
      .from(subtypeTableName)
      .upsert([{ object_id: masterData.object_id, ...subtypeData }], { onConflict: "object_id" });
    
    if (subtypeErr) throw new Error("Subtype Error: " + subtypeErr.message);

    // 5. Build Graph Edges based on linked_..._ids arrays in payload
    // Extract linked_* arrays from payload and create GraphEdges
    const edgesToCreate = [];
    const linkKeys = Object.keys(payload).filter(k => k.startsWith('linked_') && Array.isArray(payload[k]));
    
    for (const key of linkKeys) {
      // e.g., linked_proof_object_ids -> ProofObject
      // Just map generically for MVP
      const targetTypeMatch = key.match(/linked_(.+)_object_ids/);
      let targetType = "UnknownObject";
      if (targetTypeMatch) {
         targetType = targetTypeMatch[1].charAt(0).toUpperCase() + targetTypeMatch[1].slice(1) + "Object";
      }

      for (const targetId of payload[key]) {
        edgesToCreate.push({
          source_node_type: masterData.object_type,
          source_node_id: masterData.object_id,
          target_node_type: targetType,
          target_node_id: targetId,
          edge_type: "DEPENDS_ON",
          status: "ACTIVE" as const
        });
      }
    }

    for (const edge of edgesToCreate) {
      // Create a deterministic edge ID
      const edgeId = `EDGE-${edge.source_node_id}-${edge.target_node_id}`;
      try {
        await GraphEdgeService.upsert({
          edge_id: edgeId,
          ...edge
        });
      } catch (e) {
        console.warn("Failed to create edge", e);
      }
    }

    return { masterData, subtypeData };
  }

  static async getById(object_id: string, object_type?: string) {
     const supabase = createAdminClient();
     
     const { data: master } = await supabase.from("object_master").select("*").eq("object_id", object_id).single();
     if (!master) return null;

     const actualType = object_type || master.object_type;
     const subtypeTableName = `object_${actualType.toLowerCase().replace('object', '')}`;
     const { data: subtype } = await supabase.from(subtypeTableName).select("*").eq("object_id", object_id).single();

     // Recover linked identifiers from graph_edge to avoid dead-ends (No Dead-End rule)
     const { data: edges } = await supabase.from("graph_edge").select("*").eq("source_node_id", object_id).eq("status", "ACTIVE");
     const linkages: Record<string, string[]> = {};
     if (edges) {
       for (const edge of edges) {
         const targetKey = `linked_${edge.target_node_type.toLowerCase().replace('object', '')}_object_ids`;
         if (!linkages[targetKey]) linkages[targetKey] = [];
         linkages[targetKey].push(edge.target_node_id);
       }
     }

     return { 
       ...master, 
       ...subtype, 
       ...linkages,
       _raw_edges: edges || [] // expose raw edges for admin
     };
  }
}

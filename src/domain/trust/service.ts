import { createAdminClient } from "@/lib/supabase";
import { 
  PeopleSSoTSchema, 
  ReviewScopeSchema, 
  EvidenceSSoTSchema 
} from "./models";

export class TrustService {
  static async upsertPerson(payload: any) {
    const supabase = createAdminClient();
    const data = PeopleSSoTSchema.parse(payload);
    
    // Convert undefined to null for DB mapping
    const { error } = await supabase.from("people_ssot").upsert([data], { onConflict: "person_id" });
    if (error) throw new Error("PeopleSSoT Upsert Error: " + error.message);
    return data;
  }

  static async upsertScope(payload: any) {
    const supabase = createAdminClient();
    const data = ReviewScopeSchema.parse(payload);
    
    const { error } = await supabase.from("review_scope").upsert([data], { onConflict: "scope_id" });
    if (error) throw new Error("ReviewScope Upsert Error: " + error.message);
    return data;
  }

  static async upsertEvidence(payload: any) {
    const supabase = createAdminClient();
    const data = EvidenceSSoTSchema.parse(payload);
    
    const { error } = await supabase.from("evidence_ssot").upsert([data], { onConflict: "evidence_id" });
    if (error) throw new Error("EvidenceSSoT Upsert Error: " + error.message);
    return data;
  }
}

import { createAdminClient } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export class ChangeLogService {
  /**
   * Logs a governance action or content patch.
   */
  static async log(params: {
    entity_type: string;
    entity_id: string;
    change_type: string;
    change_reason?: string;
    summary_before?: any;
    summary_after?: any;
    requested_by?: string;
    approved_by?: string;
    visibility?: "internal_only" | "public_summary" | "hidden";
  }) {
    const supabase = createAdminClient();
    
    const payload = {
      change_log_id: `LOG-${uuidv4().slice(0, 8).toUpperCase()}`,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      change_type: params.change_type,
      change_reason: params.change_reason,
      summary_before: params.summary_before,
      summary_after: params.summary_after,
      requested_by: params.requested_by,
      approved_by: params.approved_by,
      visibility: params.visibility || "internal_only",
      effective_at: new Date().toISOString()
    };

    const { error } = await supabase.from("governance_changelog").insert([payload]);
    if (error) throw new Error("ChangeLog Error: " + error.message);

    return payload.change_log_id;
  }
}

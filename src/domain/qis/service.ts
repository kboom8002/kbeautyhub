import { CanonicalQuestionService } from "../canonical-question";
import { createAdminClient } from "@/lib/supabase";

export class CanonicalRegistry {
  
  static async getIntakeInbox() {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('raw_intake_question')
      .select('*')
      .eq('status', 'UNSORTED')
      .order('created_at', { ascending: false });
    
    return data || [];
  }

  static async getCanonicalQuestions() {
    try {
      const data = await CanonicalQuestionService.list();
      
      return data.map((cq: any) => ({
        cq_id: cq.canonical_question_id,
        canonical_intent: cq.title,
        category: cq.family_code || "Uncategorized",
        status: cq.status === 'ACTIVE' ? 'Active' : 'Archived',
        // In a real app we'd COUNT the related objects or slot fulfillments.
        // For MVP, we'll return 0 if no brands assigned, or random if we just want to mock the metric for now.
        coverage_percent: 0, 
        assigned_brands: 0
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

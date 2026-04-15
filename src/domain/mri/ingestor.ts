import { z } from "zod";

export const RuntimeEventSchema = z.object({
  event_type: z.enum([
    "scene_resolved", "answer_hero_view", "answer_expand_click",
    "trust_block_view", "trust_block_expand", "boundary_block_view",
    "next_question_click", "action_route_click", "consult_gate_open",
    "stale_warning_seen"
  ]),
  entity_type: z.string(),
  entity_id: z.string(),
  session_id: z.string().optional(),
  timestamp: z.string().datetime().optional()
});

export type RuntimeEvent = z.infer<typeof RuntimeEventSchema>;

export class MriIngestor {
  // In-memory array for MVP
  private static eventStore: RuntimeEvent[] = [];

  static ingest(payload: any) {
    // 1. Zod schema check (event schema invalid payload는 저장하지 말고 reject)
    const result = RuntimeEventSchema.safeParse(payload);
    
    if (!result.success) {
      throw new Error(`Invalid Payload: ${result.error.message}`);
    }

    const validEvent = result.data;
    if (!validEvent.timestamp) validEvent.timestamp = new Date().toISOString();
    
    this.eventStore.push(validEvent);
    return validEvent;
  }

  static getStore() {
    return this.eventStore;
  }
}

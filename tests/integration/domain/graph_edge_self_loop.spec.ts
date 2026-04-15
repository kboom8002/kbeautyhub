import { describe, it, expect } from 'vitest';
import { GraphEdgeService } from '@/domain/graph-edge';

describe('Graph Edge Domain', () => {
  it('blocks saving an edge with self-loop (source_id == target_id)', async () => {
    const selfLoopInput = {
      edge_id: 'EDGE-TEST-001',
      source_node_type: 'AnswerObject',
      source_node_id: 'OBJ-TEST-001',
      target_node_type: 'AnswerObject',
      target_node_id: 'OBJ-TEST-001', // Same target as source
      edge_type: 'RELATES_TO',
      status: 'ACTIVE',
    };

    // Service level and DB CHECK constraint prevent this
    await expect(GraphEdgeService.upsert(selfLoopInput as any)).rejects.toThrow('GRAPH_EDGE_SELF_LOOP_INVALID');
  });

  it('allows saving an edge with different source and target', async () => {
    const validEdgeInput = {
      edge_id: 'EDGE-TEST-002',
      source_node_type: 'AnswerObject',
      source_node_id: 'OBJ-TEST-001',
      target_node_type: 'AnswerObject',
      target_node_id: 'OBJ-TEST-002', 
      edge_type: 'RELATES_TO',
      status: 'ACTIVE',
    };

    const result = await GraphEdgeService.upsert(validEdgeInput as any);
    expect(result.edge_id).toBe('EDGE-TEST-002');
  });
});

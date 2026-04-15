import { describe, it, expect } from 'vitest';
import { ObjectService } from '@/domain/objects/service';
import { GraphEdgeService } from '@/domain/graph-edge';

describe('Object Validation & Persistence', () => {
  it('downgrades CompareObject to incomplete if fit_by_case is missing', async () => {
    const compareObj = {
      object_id: 'OBJ-CMP-TEST-001',
      object_type: 'CompareObject',
      title: 'Compare MOCK',
      compare_targets: [{id: 1}, {id: 2}],
      difference_dimensions: ['A', 'B'],
      // fit_by_case omitted
    };

    const { masterData } = await ObjectService.upsert(compareObj);
    expect(masterData.status).toBe('incomplete'); // Fallback triggered
  });

  it('fails AnswerObject if required fields are missing', async () => {
    const answerObj = {
      object_id: 'OBJ-ANS-TEST-002',
      object_type: 'AnswerObject',
      title: 'Answer MOCK',
      answer_short: 'A short answer',
      // answer_full omitted
      decision_criteria: ['Crit 1']
    };

    await expect(ObjectService.upsert(answerObj)).rejects.toThrow();
  });

  it('creates edges in object link graph automatically when linked_* arrays are present', async () => {
    const answerObj = {
      object_id: 'OBJ-ANS-TEST-003',
      object_type: 'AnswerObject',
      title: 'Answer MOCK 3',
      answer_short: 'A short answer',
      answer_full: 'Full answer context',
      decision_criteria: ['Crit 1'],
      linked_proof_object_ids: ['OBJ-PRF-MOCK-100'] // Triggers graph edge creation
    };

    await ObjectService.upsert(answerObj);

    // Verify GraphEdge created
    const edges = await GraphEdgeService.list();
    const foundEdge = edges.find(
      (e: any) => e.source_node_id === 'OBJ-ANS-TEST-003' && e.target_node_id === 'OBJ-PRF-MOCK-100'
    );
    
    expect(foundEdge).toBeDefined();
    expect(foundEdge.edge_type).toBe('DEPENDS_ON');
  });
});

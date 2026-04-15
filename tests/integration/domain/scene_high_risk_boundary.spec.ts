import { describe, it, expect } from 'vitest';
import { QISSceneService } from '@/domain/qis-scene';

describe('Scene High Risk Boundary Check', () => {
  it('blocks high risk Scene creation if BoundaryObject is missing from required_objects', async () => {
    const invalidHighRiskScene: any = {
      scene_id: 'SCENE-TEST-HR-001',
      representative_query: 'test query',
      required_objects: ['AnswerObject', 'ProofObject'], // Missing BoundaryObject
      risk_level: 'high'
    };

    await expect(QISSceneService.upsert(invalidHighRiskScene)).rejects.toThrow();
  });

  it('allows high risk Scene creation if BoundaryObject is in required_objects', async () => {
    const validHighRiskScene: any = {
      scene_id: 'SCENE-TEST-HR-002',
      representative_query: 'test query safe',
      required_objects: ['AnswerObject', 'ProofObject', 'BoundaryObject'],
      risk_level: 'high'
    };

    const result = await QISSceneService.upsert(validHighRiskScene);
    expect(result.scene_id).toBe('SCENE-TEST-HR-002');
  });
});

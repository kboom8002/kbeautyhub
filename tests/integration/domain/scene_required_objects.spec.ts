import { describe, it, expect } from 'vitest';
import { QISSceneService } from '@/domain/qis-scene';

describe('QIS Scene Domain', () => {
  it('blocks creation when required_objects is missing or invalid', async () => {
    const inputMissingObjects: any = {
      scene_id: 'SCENE-TEST-001',
      canonical_question_id: 'CQ-TEST-001',
      representative_query: 'test query',
      // required_objects explicitly omitted to test Zod requirement
    };

    await expect(QISSceneService.upsert(inputMissingObjects)).rejects.toThrow(); // Zod error

    const inputEmptyObjects: any = {
      scene_id: 'SCENE-TEST-002',
      representative_query: 'test query',
      required_objects: [] // Empty array fails min(1) constraint
    };

    await expect(QISSceneService.upsert(inputEmptyObjects)).rejects.toThrow();
  });
});

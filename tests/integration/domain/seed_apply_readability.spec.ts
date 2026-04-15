import { describe, it, expect } from 'vitest';
import { loadSeeds } from '@/scripts/seed-loader';
import { CanonicalQuestionService } from '@/domain/canonical-question';
import { QISSceneService } from '@/domain/qis-scene';

describe('Seed Apply and Readability', () => {
  it('loads CQ and Scene seeds via loaders and ensures they are readable', async () => {
    // 1. Run seed script
    await loadSeeds();

    // 2. Read them using listing functions
    const cqs = await CanonicalQuestionService.list();
    const scenes = await QISSceneService.list();

    expect(Array.isArray(cqs)).toBe(true);
    expect(cqs.length).toBeGreaterThan(0);

    expect(Array.isArray(scenes)).toBe(true);
    expect(scenes.length).toBeGreaterThan(0);

    // Verify some specific data from seed exists
    const entryCq = cqs.find((c: any) => c.canonical_question_id === 'CQ-ENTRY-001');
    expect(entryCq).toBeDefined();
    expect(entryCq.family_code).toBe('ENTRY');

    const entryScene = scenes.find((s: any) => s.scene_id === 'QIS-KBS-001');
    expect(entryScene).toBeDefined();
    expect(entryScene.required_objects).toStrictEqual(['AnswerObject', 'BoundaryObject', 'ActionObject']);
  });
});

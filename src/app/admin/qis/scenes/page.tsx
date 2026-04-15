import React from 'react';
import { CanonicalQuestionService } from '@/domain/canonical-question';
import { QISSceneService } from '@/domain/qis-scene';
import SceneConfiguratorClient from './SceneConfiguratorClient';

export default async function SceneConfiguratorPage() {
  let cqs: any[] = [];
  let scenes: any[] = [];
  try {
    [cqs, scenes] = await Promise.all([
      CanonicalQuestionService.list(),
      QISSceneService.list(),
    ]);
  } catch (err) {
    console.error('[SceneConfiguratorPage] DB fetch failed:', err);
  }

  return (
    <div className="mt-8">
      <SceneConfiguratorClient cqs={cqs ?? []} initialScenes={scenes ?? []} />
    </div>
  );
}

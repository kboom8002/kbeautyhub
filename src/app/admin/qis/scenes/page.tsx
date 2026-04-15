import React from 'react';
import { CanonicalQuestionService } from '@/domain/canonical-question';
import { QISSceneService } from '@/domain/qis-scene';
import SceneConfiguratorClient from './SceneConfiguratorClient';

export default async function SceneConfiguratorPage() {
  const cqs = await CanonicalQuestionService.list();
  const scenes = await QISSceneService.list();

  return (
    <div className="mt-8">
      <SceneConfiguratorClient cqs={cqs} initialScenes={scenes} />
    </div>
  );
}

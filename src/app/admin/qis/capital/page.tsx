import React from 'react';
import { CanonicalQuestionService } from '@/domain/canonical-question';
import { QISSceneService } from '@/domain/qis-scene';
import CapitalBoardClient from './CapitalBoardClient';

export default async function CapitalBoardPage() {
  const cqs = await CanonicalQuestionService.list();
  const scenes = await QISSceneService.list();

  return (
    <div className="mt-8">
      <CapitalBoardClient initialData={cqs} scenes={scenes} />
    </div>
  );
}

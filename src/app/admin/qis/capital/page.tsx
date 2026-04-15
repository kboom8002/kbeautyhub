import React from 'react';
import { CanonicalQuestionService } from '@/domain/canonical-question';
import { QISSceneService } from '@/domain/qis-scene';
import CapitalBoardClient from './CapitalBoardClient';

export default async function CapitalBoardPage() {
  let cqs: any[] = [];
  let scenes: any[] = [];

  try {
    [cqs, scenes] = await Promise.all([
      CanonicalQuestionService.list(),
      QISSceneService.list(),
    ]);
  } catch (err) {
    console.error('[CapitalBoardPage] DB fetch failed:', err);
  }

  return (
    <div className="mt-8">
      <CapitalBoardClient initialData={cqs ?? []} scenes={scenes ?? []} />
    </div>
  );
}

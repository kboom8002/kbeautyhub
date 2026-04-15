import React from 'react';
import { CanonicalRegistry } from '@/domain/qis/service';
import WorkbenchClient from './WorkbenchClient';

export default async function WorkbenchPage() {
  let rawInbox: any[] = [];
  try {
    rawInbox = await CanonicalRegistry.getIntakeInbox();
  } catch (err) {
    console.error('[WorkbenchPage] DB fetch failed:', err);
  }

  return (
    <div className="mt-8">
      <WorkbenchClient rawInbox={rawInbox ?? []} />
    </div>
  );
}

import React from 'react';
import { CanonicalRegistry } from '@/domain/qis/service';
import WorkbenchClient from './WorkbenchClient';

export default async function WorkbenchPage() {
  const rawInbox = await CanonicalRegistry.getIntakeInbox();

  return (
    <div className="mt-8">
      <WorkbenchClient rawInbox={rawInbox} />
    </div>
  );
}

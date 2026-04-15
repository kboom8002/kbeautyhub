import React from 'react';
import { Inbox } from 'lucide-react';
import InboxClient from './InboxClient';
import { fetchUnsortedInbox } from '@/app/actions/inbox-actions';

export default async function InboxPage() {
  let initialItems: any[] = [];
  try {
    initialItems = await fetchUnsortedInbox();
  } catch (err) {
    console.error('[InboxPage] DB fetch failed:', err);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
          <Inbox className="text-indigo-500" size={32} />
          Raw Question Inbox
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Central deposit for raw user queries before they are canonicalized.</p>
      </header>

      <InboxClient initialItems={initialItems ?? []} />
    </div>
  );
}

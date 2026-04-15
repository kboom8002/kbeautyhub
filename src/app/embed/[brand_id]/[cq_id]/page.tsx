import React from 'react';
import { SurfaceProjector } from '@/domain/surface/projector';
import RuntimeRenderer from '@/components/runtime/RuntimeRenderer';
import { ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EmbedPage({ params }: { params: Promise<{ brand_id: string, cq_id: string }>}) {
  const { brand_id, cq_id } = await params;

  // Mock Objects to bypass DB logic for MVP
  const bundle = {
    AnswerObject: {
      object_id: 'OBJ-ANS-1',
      object_type: 'AnswerObject',
      title: 'Answer for ' + cq_id,
      payload: {
        answer_short: 'This product has been thoroughly tested and is safe for sensitive skin types.',
        fit_summary: {
          recommended_for: ['Sensitive Skin', 'Daily Use'],
          not_for: [],
          caution_for: []
        }
      }
    },
    ProofObject: {
      object_id: 'OBJ-PRF-1',
      object_type: 'ProofObject',
      title: 'Clinical Approval',
      payload: {
        evidence_grade: 'A',
        reviewer_statements: ['Seoul National Dermatologists']
      }
    },
    MediaObject: {
      object_id: 'OBJ-MEDIA-1',
      object_type: 'MediaObject',
      payload: {
        has_howto: true,
        media_items: [
          { type: 'image', url: 'https://images.unsplash.com/photo-1615396899839-c99c14188eb2?auto=format&fit=crop&q=80&w=400', step_title: 'Step 1: Cleanse', description: 'Gently wash face' },
          { type: 'image', url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400', step_title: 'Step 2: Apply', description: 'Apply product evenly' }
        ]
      }
    }
  };

  const context = { user_age: 25, user_skin_type: 'unknown' };
  const risk_level = 'low';

  const fitPayload = SurfaceProjector.project(`fit-${brand_id}`, 'BrandFit', bundle, context, risk_level);

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center pt-4 pb-12 font-sans w-full max-w-[600px] mx-auto overflow-hidden">
      <div className="w-full flex-1">
        {/* Render Only the Fit Payload for this Embed */}
        <RuntimeRenderer payload={fitPayload} />
      </div>

      {/* Watermark */}
      <a 
        href="https://kbeautyhub.com" 
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition duration-300"
      >
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Verified by</span>
        </div>
        <div className="text-sm font-black tracking-tighter text-slate-300 mt-0.5 shadow-sm">
          K-Beauty<span className="text-indigo-400">Hub</span> SSoT
        </div>
      </a>
    </div>
  );
}

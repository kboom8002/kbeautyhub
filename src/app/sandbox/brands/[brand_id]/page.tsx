import React from 'react';
// import { BrandService } from '@/domain/brand/service';
import { SurfaceProjector } from '@/domain/surface/projector';
import RuntimeRenderer from '@/components/runtime/RuntimeRenderer';

export default async function BrandSandboxPage({ params }: { params: Promise<{ brand_id: string } >}) {
  const { brand_id } = await params;

  // 1. Mock Objects to bypass Next.js Prisma Edge bundling issue
  const bundle = {
    AnswerObject: {
      object_id: 'OBJ-ANS-1',
      object_type: 'AnswerObject',
      title: 'Is this for me?',
      payload: {
        answer_short: 'Yes, perfect for deep hydration.',
        fit_summary: {
          recommended_for: ['Dry Skin', 'Winter Usage'],
          not_for: ['Oily blemish-prone skin'],
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
    ActionObject: {
      object_id: 'OBJ-ACT-1',
      object_type: 'ActionObject',
      payload: {
        recommended_routes: [
          { target: 'brand_buy_page' },
          { target: 'consult_gate' }
        ]
      }
    }
  };

  // Mock Context
  const context = { user_age: 25, user_skin_type: 'unknown' };
  
  // Decide risk (In reality, calculated via AnswerObject's risk_level)
  const isHighRisk = bundle.AnswerObject?.payload?.fit_summary?.caution_for?.length > 0;
  const risk_level = isHighRisk ? 'high' : 'low';

  // 3. Project Surfaces
  const startPayload = SurfaceProjector.project(`start-${brand_id}`, 'BrandStart', bundle, context, risk_level);
  const fitPayload = SurfaceProjector.project(`fit-${brand_id}`, 'BrandFit', bundle, context, risk_level);
  const proofPayload = SurfaceProjector.project(`proof-${brand_id}`, 'BrandProof', bundle, context, risk_level);
  const actionPayload = SurfaceProjector.project(`action-${brand_id}`, 'BuyOrConsult', bundle, context, risk_level);

  return (
    <div className="min-h-screen bg-slate-100/50 py-12 px-4 sm:px-6">
      
      <div className="max-w-4xl mx-auto mb-8 bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-700 tracking-wider text-sm uppercase">K-Beauty Sandbox Live</span>
        </div>
        <div className="text-slate-500 text-sm font-mono bg-slate-100 px-3 py-1 rounded-md">
          {brand_id} | Risk: {risk_level.toUpperCase()}
        </div>
      </div>

      {/* Render Stack Sequence */}
      <RuntimeRenderer payload={startPayload} />
      <RuntimeRenderer payload={fitPayload} />
      <RuntimeRenderer payload={proofPayload} />
      <RuntimeRenderer payload={actionPayload} />

    </div>
  );
}

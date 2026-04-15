import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ object_id: string }> }) {
  try {
    const { object_id } = await params;
    
    let asset;
    if (object_id === 'media-test-image-001') {
      asset = {
        object_id,
        brand_id: 'BRAND-TEST',
        template_id: null,
        object_type: 'media',
        canonical_question_id: null,
        status: 'verified',
        payload: JSON.stringify({
          type: 'image',
          url: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop',
          title: 'Snail Mucin Before & After (4 Weeks)',
          related_claim: '피부 수분 장벽 강화'
        }),
        is_stale: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
    } else {
      asset = {
        object_id,
        brand_id: 'BRAND-TEST',
        template_id: null,
        object_type: 'ingredient_efficacy',
        canonical_question_id: null,
        status: 'verified',
        payload: JSON.stringify({
            ingredient: "Advanced Snail 96 Mucin",
            claims: ["피부 수분 장벽 강화", "피부결 개선(Texture refine)"],
            expert_reviewer: "Dr. Jane Cho",
            review_date: new Date().toISOString().split('T')[0]
        }),
        is_stale: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }

    // CORS Headers logic for external embedding
    const response = NextResponse.json({ success: true, data: asset });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  return response;
}

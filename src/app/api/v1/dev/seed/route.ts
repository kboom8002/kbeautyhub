import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brand = await prisma.brand.upsert({
      where: { brand_id: 'BRAND-001' },
      update: {},
      create: {
        brand_id: 'BRAND-001',
        name: '코스알엑스 (COSRX)',
        readiness_score: 98.5
      }
    });

    const payload = JSON.stringify({
      ingredient: "Advanced Snail 96 Mucin",
      claims: ["피부 수분 장벽 강화", "피부결 개선"],
      expert_reviewer: "Dr. Jane Cho",
      review_date: new Date().toISOString().split('T')[0]
    });

    // Check if asset already exists
    const existing = await prisma.kBeautyObject.findFirst({
      where: { brand_id: brand.brand_id, object_type: 'ingredient_efficacy' }
    });

    let asset;
    if (!existing) {
      asset = await prisma.kBeautyObject.create({
        data: {
          brand_id: brand.brand_id,
          object_type: "ingredient_efficacy",
          status: "verified",
          payload: payload
        }
      });
    } else {
      asset = existing;
    }

    return NextResponse.json({ success: true, brand_id: brand.brand_id, asset_id: asset.object_id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { BrandPackGenerator } from '@/domain/factory/brand-pack-generator';

export async function POST(req: Request) {
  try {
    const { template_ids, brand_id } = await req.json();
    
    if (!template_ids || !Array.isArray(template_ids) || !brand_id) {
      return NextResponse.json({ error: "Invalid payload: Needs template_ids and brand_id" }, { status: 400 });
    }

    const instantiated = BrandPackGenerator.instantiate(template_ids, brand_id);

    return NextResponse.json({ success: true, objects: instantiated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

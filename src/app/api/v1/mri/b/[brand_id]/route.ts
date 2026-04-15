import { NextResponse } from 'next/server';
import { ReadinessCalculator } from '@/domain/brand/readiness-calculator';

export async function GET(req: Request, { params }: { params: Promise<{ brand_id: string } >}) {
  try {
    const { brand_id } = await params;
    
    // Calculate B-MRI (Readiness)
    const result = await ReadinessCalculator.calculateBMRIScore(brand_id);

    return NextResponse.json({ 
      brand_id,
      readiness: result 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { BrandService } from '@/domain/brand/service';
import { SurfaceProjector } from '@/domain/surface/projector';

export async function GET(req: Request, { params }: { params: Promise<{ brand_id: string } >}) {
  try {
    const { brand_id } = await params;
    const { searchParams } = new URL(req.url);
    const riskLevel = searchParams.get("risk") || "low";
    
    const objects = await BrandService.getTestScopedObjects(brand_id);
    const act = objects.find((o: any) => o.object_type === 'ActionObject');

    const bundle = {
      ActionObject: act
    };

    const payload = SurfaceProjector.project(
      `SURF-BOC-${brand_id}`,
      "BuyOrConsult",
      bundle,
      {},
      riskLevel
    );

    return NextResponse.json(payload, { status: 200 });

  } catch (error: any) {
    if (error.message.includes("CONTRACT_VIOLATION") || error.message.includes("MISSING_REQUIRED")) {
      return NextResponse.json({ error: error.message, is_blocked: true }, { status: 422 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

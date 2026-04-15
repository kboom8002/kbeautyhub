import { NextResponse } from 'next/server';
import { BrandService } from '@/domain/brand/service';
import { SurfaceProjector } from '@/domain/surface/projector';

export async function GET(req: Request, { params }: { params: Promise<{ brand_id: string, cq_id: string } >}) {
  try {
    const { brand_id, cq_id } = await params;
    
    // Fetch scoped objects specifically for this fit canonical question
    const objects = await BrandService.getTestScopedObjects(brand_id, cq_id);
    
    const ans = objects.find((o: any) => o.object_type === 'AnswerObject');
    const act = objects.find((o: any) => o.object_type === 'ActionObject'); // Optional

    const bundle = {
      AnswerObject: ans,
      ActionObject: act
    };

    const payload = SurfaceProjector.project(
      `SURF-FIT-${brand_id}`,
      "BrandFit",
      bundle,
      {},
      "medium" // Default fit to medium risk to test rules
    );

    return NextResponse.json(payload, { status: 200 });

  } catch (error: any) {
    if (error.message.includes("CONTRACT_VIOLATION") || error.message.includes("MISSING_REQUIRED")) {
      return NextResponse.json({ error: error.message, is_blocked: true }, { status: 422 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

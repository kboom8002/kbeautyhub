import { NextResponse } from 'next/server';
import { BrandService } from '@/domain/brand/service';
import { SurfaceProjector } from '@/domain/surface/projector';

export async function GET(req: Request, { params }: { params: Promise<{ brand_id: string } >}) {
  try {
    const { brand_id } = await params;
    
    // We fetch scoped objects (acting as a "Start" topic bundle)
    const objects = await BrandService.getTestScopedObjects(brand_id);
    
    // The "Start" surface prefers an AnswerObject representation
    const ans = objects.find((o: any) => o.object_type === 'AnswerObject');
    const act = objects.find((o: any) => o.object_type === 'ActionObject');

    const bundle = {
      AnswerObject: ans,
      ActionObject: act
    };

    const payload = SurfaceProjector.project(
      `SURF-START-${brand_id}`,
      "BrandStart",
      bundle,
      {}, // trustBundle mocked
      "low" // risk level
    );

    return NextResponse.json(payload, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

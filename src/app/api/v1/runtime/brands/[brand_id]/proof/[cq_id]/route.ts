import { NextResponse } from 'next/server';
import { BrandService } from '@/domain/brand/service';
import { SurfaceProjector } from '@/domain/surface/projector';

export async function GET(req: Request, { params }: { params: Promise<{ brand_id: string, cq_id: string } >}) {
  try {
    const { brand_id, cq_id } = await params;
    
    const objects = await BrandService.getTestScopedObjects(brand_id, cq_id);
    const prf = objects.find((o: any) => o.object_type === 'ProofObject');

    const bundle = {
      ProofObject: prf
    };

    const payload = SurfaceProjector.project(
      `SURF-PROOF-${brand_id}`,
      "BrandProof",
      bundle,
      {},
      "low"
    );

    return NextResponse.json(payload, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

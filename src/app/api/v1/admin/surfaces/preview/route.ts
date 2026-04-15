import { NextResponse } from 'next/server';
import { RBACGuard } from '@/domain/admin/rbac';
import { SurfaceProjector } from '@/domain/surface/projector';
import { ObjectBundleComposer } from '@/domain/object-bundle/composer';

export async function POST(req: Request) {
  const role = req.headers.get('x-admin-role');
  
  try {
    RBACGuard.requirePermission(role, 'READ_ALL');

    const body = await req.json();
    const { scene_id, surface_type, mock_trust_bundle = {}, override_risk_level } = body;

    if (!scene_id || !surface_type) {
      return NextResponse.json({ error: "scene_id and surface_type required" }, { status: 400 });
    }

    // 1. Compose Object Bundle
    let bundle = {};
    try {
      bundle = await ObjectBundleComposer.compose(scene_id);
    } catch (composeError: any) {
      // In preview lab, display if it crashes at compose layer
      return NextResponse.json({
         preview_failed: true,
         layer: "ObjectBundleComposer",
         reason: composeError.message
      }, { status: 422 });
    }

    // Determine Risk (Use provided override or default to low if bundle lacks it)
    // Real implementation would pull from primary object
    const simulatedRisk = override_risk_level || "low";

    // 2. Project Surface
    const projection = SurfaceProjector.project(
      `PRV-${scene_id}`, 
      surface_type, 
      bundle, 
      mock_trust_bundle, 
      simulatedRisk
    );

    // 3. Decorate with Slot visibility logging for Admin Lab
    const labContext = {
      total_slots: projection.slots.length,
      visible_slots: projection.slots.filter((s: any) => s.visible).map((s: any) => s.slot_id),
      hidden_slots: projection.slots.filter((s: any) => !s.visible).map((s: any) => s.slot_id),
      detected_variant: projection.variant,
      is_fallback_triggered: projection.variant === 'warning' || projection.variant === 'blocked'
    };

    return NextResponse.json({
      surface_payload: projection,
      lab_context: labContext
    }, { status: 200 });

  } catch (error: any) {
    if (error.message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

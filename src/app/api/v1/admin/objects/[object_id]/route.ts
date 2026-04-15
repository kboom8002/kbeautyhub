import { NextResponse } from 'next/server';
import { ObjectService } from '@/domain/objects/service';
import { RBACGuard } from '@/domain/admin/rbac';

export async function GET(req: Request, { params }: { params: Promise<{ object_id: string }> }) {
  const role = req.headers.get('x-admin-role');
  
  try {
    // 1. Check RBAC
    RBACGuard.requirePermission(role, 'READ_ALL');

    const { object_id } = await params;
    
    // 2. Fetch Master + Subtype + Links
    const objectData = await ObjectService.getById(object_id);
    if (!objectData) {
      return NextResponse.json({ error: "Object Not Found" }, { status: 404 });
    }

    // 2.1 Tenant Isolation Guard
    const tenantId = req.headers.get('x-tenant-id');
    const objectTenant = objectData.tenant_id || objectData.brand_id;
    if (tenantId !== 'SYSTEM' && objectTenant && objectTenant !== tenantId) {
      return NextResponse.json({ error: "FORBIDDEN: Cross-Tenant Access Denied" }, { status: 403 });
    }

    // 3. Compute Missing Link / Health Analysis Flags
    const links = objectData._raw_edges || [];
    const isHighRisk = objectData.risk_level === 'high';
    
    const hasBoundary = links.some((l: any) => l.target_node_type === 'BoundaryObject');
    const hasProof = links.some((l: any) => l.target_node_type === 'ProofObject');
    
    // Safety Requirement DTO Flagging
    const missing_boundary = isHighRisk && !hasBoundary;
    const missing_proof = !hasProof;

    const healthSummary = {
      is_publish_ready: !missing_boundary && !missing_proof,
      missing_boundary,
      missing_proof,
      status: objectData.status
    };

    return NextResponse.json({
      object: objectData,
      linked_objects: links,
      health: healthSummary
    }, { status: 200 });

  } catch (error: any) {
    if (error.message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Write Flow Stub (for Object Studio edits/publishes)
export async function PUT(req: Request, { params }: { params: Promise<{ object_id: string }> }) {
  const role = req.headers.get('x-admin-role');
  try {
    RBACGuard.requirePermission(role, 'WRITE_OBJECT');
    
    // Action details check (Prevent sys properties updates)
    const body = await req.json();

    // Tenant Isolation Guard
    const tenantId = req.headers.get('x-tenant-id');
    const targetTenant = body.tenant_id || body.brand_id;
    if (tenantId !== 'SYSTEM' && targetTenant && targetTenant !== tenantId) {
      return NextResponse.json({ error: "FORBIDDEN: Cross-Tenant Access Denied" }, { status: 403 });
    }
    
    // Shared template enforcement
    if (body.tenant_id === 'SYSTEM' || body.is_shared_template) {
       RBACGuard.requirePermission(role, 'EDIT_SHARED_TEMPLATE');
    }
    
    if (body.action === 'PUBLISH') {
       RBACGuard.requirePermission(role, 'PUBLISH_OBJECT'); // Prevent implicit reviewer publish
       // orchestrator run...
    }

    return NextResponse.json({ success: true, message: "Object Updated" }, { status: 200 });
  } catch (error: any) {
    if (error.message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

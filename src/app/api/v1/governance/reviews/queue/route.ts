import { NextResponse } from 'next/server';
import { RBACGuard } from '@/domain/admin/rbac';
import { createAdminClient } from '@/lib/supabase';

export async function GET(req: Request) {
  const role = req.headers.get('x-admin-role');
  
  try {
    RBACGuard.requirePermission(role, 'READ_ALL');
    
    const supabase = createAdminClient();

    // 1. Fetch items pending review
    const { data: objects, error } = await supabase
       .from('object_master')
       .select('*, graph_edge(target_node_id, target_node_type, edge_type)')
       .eq('status', 'DRAFT') // DRAFT or pending review state
       .order('updated_at', { ascending: false });
       
    if (error) throw error;

    // 2. Pre-process for Reviewer UI
    const queue = objects?.map(obj => {
      // Analyze missing requirements
      const links = obj.graph_edge || [];
      const isHighRisk = obj.risk_level === 'high';
      
      const missing_requirements = [];
      const hasBoundary = links.some((l: any) => l.target_node_type === 'BoundaryObject');
      const hasProof = links.some((l: any) => l.target_node_type === 'ProofObject');

      if (isHighRisk && !hasBoundary) missing_requirements.push('BOUNDARY_REQUIRED');
      if (!hasProof) missing_requirements.push('EVIDENCE_REQUIRED');

      // Due calculation: MVP mock (+3 days from update)
      const updatedAt = new Date(obj.updated_at);
      const dueAt = new Date(updatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);

      return {
        object_id: obj.object_id,
        title: obj.title,
        risk_level: obj.risk_level,
        due_at: dueAt.toISOString(),
        missing_requirements,
        assigned_reviewer: 'UNASSIGNED', // TBD in MVP DB schema
        is_ready_to_approve: missing_requirements.length === 0
      };
    }) || [];

    // Filter out only ones needing review, or leave all drafts
    // In real env, we might filter where publish was requested.

    return NextResponse.json({
      queue_count: queue.length,
      items: queue
    }, { status: 200 });

  } catch (error: any) {
    console.error("Queue Route Error:", error);
    if (error.message && error.message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

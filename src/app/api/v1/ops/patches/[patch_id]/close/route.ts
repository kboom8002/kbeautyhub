import { NextResponse } from 'next/server';
import { PatchOpsBoard } from '@/domain/ops/patch-board';
import { RBACGuard } from '@/domain/admin/rbac';

export async function POST(req: Request, { params }: { params: Promise<{ patch_id: string } >}) {
  const role = req.headers.get('x-admin-role');

  try {
    RBACGuard.requirePermission(role, 'READ_ALL'); // Assume basic ops role needed

    const { patch_id } = await params;
    const body = await req.json();
    
    // Attempt closure. Will enforcing retest guards!
    const closedTicket = PatchOpsBoard.closeTicket(patch_id, body.retest_id, body.is_exempt);

    return NextResponse.json({ success: true, ticket: closedTicket }, { status: 200 });
  } catch (error: any) {
    if (error.message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message.includes("RETEST_REQUIRED") || error.message.includes("RETEST_FAILED")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { AuditLogger } from '@/domain/launch/audit-logger';
import { ReleaseGateChecker } from '@/domain/launch/release-gate';

// In a real implementation this would fetch all active brands from the DB
const MOCK_ACTIVE_BRANDS = ['BRAND-1', 'BRAND-2'];

export async function GET() {
  try {
    const logs = await AuditLogger.getLogs();
    
    // Evaluate readiness for all active brands
    const readinessReports = await Promise.all(
      MOCK_ACTIVE_BRANDS.map(id => ReleaseGateChecker.checkReadiness(id))
    );

    return NextResponse.json({
      success: true,
      data: {
        recent_audits: logs.slice(-5), // Last 5
        readiness_reports: readinessReports
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

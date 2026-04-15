import { prisma } from '@/lib/prisma';

export type AuditEvent = {
  log_id: string;
  action: 'ROLLBACK' | 'FEATURE_FLAG_CHANGE' | 'GATE_OVERRIDE';
  target_brand_id?: string;
  reason: string;
  timestamp: string;
  actor_id: string; 
};

export class AuditLogger {
  
  static async log(
    action: string, 
    reason: string, 
    actor_id: string = 'SYSTEM', 
    target_brand_id?: string
  ) {
    const record = await prisma.auditLog.create({
      data: {
        action,
        reason,
        actor_id,
        target_brand_id: target_brand_id || null
      }
    });
    return record;
  }

  static async getLogs() {
    return await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }
}

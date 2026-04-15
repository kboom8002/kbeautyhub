import { MRIAlert } from '../mri/alert-engine';
import { RetestRunner } from './retest-runner';

export type PatchStatus = 'open' | 'triaged' | 'in_fix' | 'review_pending' | 'retest_pending' | 'closed';

export type PatchTicket = {
  patch_ticket_id: string;
  primary_alert_id: string;
  entity_type: string;
  entity_id: string;
  severity: "low" | "medium" | "high" | "critical";
  priority: "P0" | "P1" | "P2" | "P3" | "P4";
  trigger_source: string;
  summary: string;
  rca_codes: string[];
  status: PatchStatus;
  retest_required: boolean;
  linked_retest_id?: string;
  created_at: string;
};

export class PatchOpsBoard {
  private static ticketStore: PatchTicket[] = [];

  static createTicket(alert: MRIAlert): PatchTicket {
    // 04_patch_ops_board.md: P0/P1 triage for critical severity
    const priority = alert.severity === 'critical' ? 'P0' : alert.severity === 'high' ? 'P1' : 'P3';

    const ticket: PatchTicket = {
      patch_ticket_id: `PT-${Date.now()}`,
      primary_alert_id: alert.alert_id,
      entity_type: alert.entity_type,
      entity_id: alert.entity_id,
      severity: alert.severity,
      priority,
      trigger_source: alert.mri_type,
      summary: `Auto-generated patch ticket for ${alert.metric_key} deviation`,
      rca_codes: alert.suspected_rca_codes,
      status: 'open',
      retest_required: true, // mandatory by default
      created_at: new Date().toISOString()
    };

    
    this.ticketStore.push(ticket);
    return ticket;
  }

  static closeTicket(patch_ticket_id: string, retest_id?: string, is_exempt: boolean = false) {
    const ticket = this.ticketStore.find(t => t.patch_ticket_id === patch_ticket_id);
    if (!ticket) throw new Error("Ticket Not Found");

    // "patch close without retest를 허용하지 마라"
    if (ticket.retest_required && !is_exempt) {
      if (!retest_id) {
        throw new Error("RETEST_REQUIRED: Cannot close patch ticket without a passed retest id");
      }
      // verify the retest passed
      const run = RetestRunner.getRun(retest_id);
      if (!run || run.status !== 'passed') {
        throw new Error("RETEST_FAILED: Cannot close patch ticket as retest hasn't passed");
      }
      ticket.linked_retest_id = retest_id;
    }

    ticket.status = 'closed';
    return ticket;
  }

  static getStore() {
    return this.ticketStore;
  }
}

import { describe, it, expect } from 'vitest';
import { MriIngestor } from '@/domain/mri/ingestor';
import { MriAggregator } from '@/domain/mri/aggregator';
import { AlertEngine } from '@/domain/mri/alert-engine';
import { PatchOpsBoard } from '@/domain/ops/patch-board';
import { RetestRunner } from '@/domain/ops/retest-runner';

describe('MRI & Ops Loop', () => {

  it('rejects invalid runtime events via schema', () => {
    expect(() => {
      MriIngestor.ingest({ event_type: "unknown_event", entity_type: "Scene", entity_id: "S-1" });
    }).toThrowError(/Invalid Payload/);
  });

  it('ingests valid events', () => {
    const ev = MriIngestor.ingest({ event_type: "boundary_block_view", entity_type: "Scene", entity_id: "HR-1" });
    expect(ev.timestamp).toBeDefined();
    
    // Simulate high-risk decay
    MriIngestor.ingest({ event_type: "stale_warning_seen", entity_type: "Scene", entity_id: "HR-1" });
    MriIngestor.ingest({ event_type: "stale_warning_seen", entity_type: "Scene", entity_id: "HR-1" });
    MriIngestor.ingest({ event_type: "stale_warning_seen", entity_type: "Scene", entity_id: "HR-1" });
  });

  it('aggregates events into D-MRI snapshot and breaches threshold', () => {
    // HR-1 has one boundary_block_view, but 3 stale_warning_seen.
    const snapshot = MriAggregator.aggregate("Scene", "HR-1", true);
    
    // Base 50 + 20 (prec) + 15 (boundary) + 0 (trust - penalized 15 pts by 3 stales) = 85 (A)
    // Wait, 15 - (3 * 5) = 0. So score = 50 + 20 + 0 + 15 = 85.
    // However, trust_sufficiency is now 0 (< 10). This violates Alert rule!
    expect(snapshot.dimensions.trust_sufficiency).toBe(0);
    expect(snapshot.is_high_risk).toBe(true);

    // 2. Alert Engine catches low trust on high risk -> Critical Severity
    const alert = AlertEngine.evaluate(snapshot);
    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('critical'); // High risk elevation
    expect(alert!.status).toBe('open');
    expect(alert!.suspected_rca_codes).toContain('RCA-GOV-01');
  });

  it('elevates high-risk boundary missing to critical severity', () => {
    // Scene HR-2 has NO boundary block views, but is high risk
    MriIngestor.ingest({ event_type: "answer_hero_view", entity_type: "Scene", entity_id: "HR-2" });
    const snapshot = MriAggregator.aggregate("Scene", "HR-2", true);
    
    expect(snapshot.dimensions.boundary_explicitness).toBe(0);
    
    const alert = AlertEngine.evaluate(snapshot);
    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('critical');
    expect(alert!.metric_key).toBe('boundary_explicitness');
  });

  it('creates a patch ticket and enforces Retest Guard before closing', () => {
    // Get the alert from previous HR-2
    const alerts = AlertEngine.getStore();
    const targetAlert = alerts.find(a => a.entity_id === 'HR-2')!;

    // 3. Create Ticket
    const ticket = PatchOpsBoard.createTicket(targetAlert);
    expect(ticket.severity).toBe('critical');
    expect(ticket.retest_required).toBe(true);
    expect(ticket.status).toBe('open');

    // Attempt to close without retest -> fail
    expect(() => {
      PatchOpsBoard.closeTicket(ticket.patch_ticket_id);
    }).toThrowError(/RETEST_REQUIRED/);

    // 4. Create Retest Run (simulate developer work done)
    const run = RetestRunner.createRun(ticket.patch_ticket_id);
    expect(run.status).toBe('pending');
    
    // Simulate Failure
    RetestRunner.mockExecuteRun(run.retest_run_id, false);
    
    // Attempt closure with failed retest -> fail
    expect(() => {
      PatchOpsBoard.closeTicket(ticket.patch_ticket_id, run.retest_run_id);
    }).toThrowError(/RETEST_FAILED/);

    // Simulate Success
    RetestRunner.mockExecuteRun(run.retest_run_id, true);

    // Attempt closure with successful retest -> pass
    const closed = PatchOpsBoard.closeTicket(ticket.patch_ticket_id, run.retest_run_id);
    expect(closed.status).toBe('closed');
    expect(closed.linked_retest_id).toBe(run.retest_run_id);
  });
});

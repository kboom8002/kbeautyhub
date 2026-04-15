import { DMriSnapshot } from './aggregator';

export type MRIAlert = {
  alert_id: string;
  mri_type: 'D-MRI' | 'B-MRI';
  entity_type: string;
  entity_id: string;
  metric_key: string;
  severity: "low" | "medium" | "high" | "critical";
  suspected_rca_codes: string[];
  status: "open" | "acknowledged" | "routed" | "closed";
  created_at: string;
};

export class AlertEngine {
  // In-memory store for MVP
  private static alertStore: MRIAlert[] = [];

  static evaluate(snapshot: DMriSnapshot): MRIAlert | null {
    let alertToCreate: Partial<MRIAlert> | null = null;

    // Rule 1: High-risk trust/boundary degradation -> critical severity (RCA-TR-05, RCA-GOV-01)
    if (snapshot.is_high_risk && snapshot.dimensions.boundary_explicitness === 0) {
      alertToCreate = {
        metric_key: 'boundary_explicitness',
        severity: 'critical', // Elevate priority for high-risk boundary drop
        suspected_rca_codes: ['RCA-TR-05', 'RCA-SF-02']
      };
    } else if (snapshot.dimensions.trust_sufficiency < 10) {
      alertToCreate = {
        metric_key: 'trust_sufficiency',
        severity: snapshot.is_high_risk ? 'critical' : 'high',
        suspected_rca_codes: ['RCA-GOV-01', 'RCA-SF-01']
      };
    } else if (snapshot.score <= 69) { // C grade or lower -> threshold breach
      alertToCreate = {
        metric_key: 'overall_score',
        severity: 'medium',
        suspected_rca_codes: ['RCA-QA-01']
      };
    }

    if (alertToCreate) {
      const alert: MRIAlert = {
        alert_id: `ALT-${Date.now()}`,
        mri_type: 'D-MRI',
        entity_type: snapshot.entity_type,
        entity_id: snapshot.entity_id,
        metric_key: alertToCreate.metric_key!,
        severity: alertToCreate.severity as any,
        status: 'open',
        suspected_rca_codes: alertToCreate.suspected_rca_codes || [],
        created_at: new Date().toISOString()
      };
      // explicitly assert status and severity exist (alert without explicit severity/status를 만들지 마라)
      if (!alert.severity || !alert.status) throw new Error("Alert must have severity and status");

      this.alertStore.push(alert);
      return alert;
    }

    return null; // No threshold breached
  }

  static getStore() {
    return this.alertStore;
  }
}

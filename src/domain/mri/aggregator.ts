import { MriIngestor } from './ingestor';

export type DMriSnapshot = {
  entity_type: string;
  entity_id: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  dimensions: {
    answer_precision: number;
    trust_sufficiency: number;
    boundary_explicitness: number;
    // other dimensions...
  };
  is_high_risk: boolean;
};

export class MriAggregator {
  static aggregate(entity_type: string, entity_id: string, isHighRisk: boolean = false): DMriSnapshot {
    const events = MriIngestor.getStore().filter(
      e => e.entity_id === entity_id && e.entity_type === entity_type
    );

    // Baseline dimension scores
    const dimensions = {
      answer_precision: 20, 
      trust_sufficiency: 15,
      boundary_explicitness: 15
    };

    // MVP Heuristic Deductions based on bad events:
    // Every stale_warning_seen drops trust_sufficiency
    const staleCount = events.filter(e => e.event_type === "stale_warning_seen").length;
    dimensions.trust_sufficiency = Math.max(0, dimensions.trust_sufficiency - (staleCount * 5));

    // If high risk and no boundary_block_view events are seen, penalize boundary heavily
    const boundaryViews = events.filter(e => e.event_type === "boundary_block_view").length;
    if (isHighRisk && boundaryViews === 0) {
      dimensions.boundary_explicitness = 0; // Huge penalty
    }

    const baseScore = 50; // Assume 50 points from other fixed dimensions for MVP simplicity
    const totalScore = baseScore + dimensions.answer_precision + dimensions.trust_sufficiency + dimensions.boundary_explicitness;

    return {
      entity_type,
      entity_id,
      score: totalScore,
      grade: this.calculateGrade(totalScore),
      dimensions,
      is_high_risk: isHighRisk
    };
  }

  private static calculateGrade(score: number) {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 55) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  }
}

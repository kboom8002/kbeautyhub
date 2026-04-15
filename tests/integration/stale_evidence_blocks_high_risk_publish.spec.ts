import { describe, it, expect } from "vitest";

describe("stale evidence blocks high-risk publish", () => {
  it("blocks when only stale critical evidence is attached", async () => {
    const object = {
      object_id: "OBJ-PRF-TEST-001",
      canonical_question_id: "CQ-ING-006",
      risk_level: "high",
      evidence: [
        {
          evidence_id: "EVD-STALE-001",
          status: "stale_critical"
        }
      ]
    };

    const result = await validateEvidenceFreshnessForPublish(object);

    expect(result.allowed).toBe(false);
    expect(result.reason_code).toBe("EVIDENCE_STALE_BLOCKED");
  });
});

async function validateEvidenceFreshnessForPublish(object: any) {
  const onlyCritical = object.evidence.every((e: any) => e.status === "stale_critical");
  if (object.risk_level === "high" && onlyCritical) {
    return { allowed: false, reason_code: "EVIDENCE_STALE_BLOCKED" };
  }
  return { allowed: true };
}

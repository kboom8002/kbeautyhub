import { describe, it, expect } from "vitest";

describe("publish blocked when boundary missing", () => {
  it("blocks high-risk object publish without boundary object", async () => {
    const object = {
      object_id: "OBJ-ANS-TEST-001",
      object_type: "AnswerObject",
      canonical_question_id: "CQ-FIT-004",
      risk_level: "high",
      linked_boundary_object_ids: [],
      evidence_ids: ["EVD-441"],
      reviewer_ids: ["PER-102"]
    };

    const result = await fakePublishOrchestrator(object);

    expect(result.status).toBe("blocked");
    expect(result.reason_code).toBe("BOUNDARY_REQUIRED");
  });
});

async function fakePublishOrchestrator(object: any) {
  if (object.risk_level === "high" && (!object.linked_boundary_object_ids || object.linked_boundary_object_ids.length === 0)) {
    return { status: "blocked", reason_code: "BOUNDARY_REQUIRED" };
  }
  return { status: "published" };
}

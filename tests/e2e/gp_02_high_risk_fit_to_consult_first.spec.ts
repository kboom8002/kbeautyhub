import { test, expect } from "@playwright/test";

test("GP-02 high risk fit resolves to consult-safe runtime behavior", async ({ request }) => {
  const resolveRes = await request.post("/api/v1/runtime/query-resolve", {
    data: {
      vertical_id: "V-KBS",
      query: "민감 피부도 이 세럼 써도 되나"
    }
  });

  expect(resolveRes.ok()).toBeTruthy();
  const resolveJson = await resolveRes.json();

  expect(resolveJson.data.canonical_question_id).toBe("CQ-FIT-004");
  expect(resolveJson.data.risk_level).toBe("high");

  const renderRes = await request.get(
    `/api/v1/runtime/surfaces/SH-TOPIC-ANSWER?scene_id=${resolveJson.data.scene_id}&tenant_id=TEN-KBS-001`
  );

  expect(renderRes.ok()).toBeTruthy();
  const renderJson = await renderRes.json();

  const slots = renderJson.data.slots;
  const boundarySlot = slots.find((s: any) => s.slot_id === "boundary_block");
  const actionSlot = slots.find((s: any) => s.slot_id === "action_module");

  expect(boundarySlot).toBeDefined();
  expect(boundarySlot.visible).toBe(true);

  expect(actionSlot).toBeDefined();
  expect(["consult_first", "warning", "default"]).toContain(actionSlot.render_variant);

  const actionData = actionSlot.data ?? {};
  expect(actionData.primary_cta_type).not.toBe("buy_only");
});

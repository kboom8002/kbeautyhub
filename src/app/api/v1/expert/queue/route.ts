import { NextResponse } from 'next/server';

export async function GET() {
  // Prototyping mock data for Expert Queue to bypass DB complexities
  const payload = [
    {
      queue_id: 'q-992-draft-001',
      brand_name: 'COSRX',
      object_type: 'ingredient_efficacy',
      request_date: new Date().toISOString().split('T')[0],
      source_data: {
        ingredient: "Advanced Snail 96 Mucin",
        claims: ["피부 수분 장벽 강화", "피부결 개선(Texture refine)"]
      },
      ai_draft: "요즘 피부가 푸석하고 거칠게 느껴지시나요? 달팽이 점액 여과물(Snail Mucin)은 자연이 주는 가장 강력한 보습 치트키 중 하나랍니다! 🐌✨ 96%의 고농축 점액이 피부 깊숙이 스며들어, 무너져가는 수분 장벽을 쫀쫀하게 채워주고 울퉁불퉁한 피부결을 매끈하게 다듬어 줍니다. 끈적이지 않고 쏙 스며드는 발림성 덕분에 속건조로 고생하는 수부지 피부에도 완벽한 솔루션이 되어줄 거예요!"
    }
  ];

  return NextResponse.json({ success: true, pending_queue: payload });
}

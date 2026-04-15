import { prisma } from '../src/lib/prisma';

async function main() {
  const brand = await prisma.brand.upsert({
    where: { brand_id: 'BRAND-001' },
    update: {},
    create: {
      brand_id: 'BRAND-001',
      name: '코스알엑스 (COSRX)',
      readiness_score: 98.5
    }
  });

  const payload = JSON.stringify({
    ingredient: "Advanced Snail 96 Mucin",
    claims: ["피부 수분 장벽 강화", "피부결 개선"],
    expert_reviewer: "Dr. Jane Cho",
    review_date: "2026-04-10"
  });

  const asset = await prisma.kBeautyObject.create({
    data: {
      brand_id: brand.brand_id,
      object_type: "ingredient_efficacy",
      status: "verified",
      payload: payload
    }
  });

  console.log("Seeded Brand:", brand.brand_id);
  console.log("Seeded Asset:", asset.object_id);
}

main().catch(console.error).finally(()=> prisma.$disconnect());

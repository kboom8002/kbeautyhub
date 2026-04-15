import { v4 as uuidv4 } from "uuid";
import { TemplateRegistry } from "./template-registry";
import { prisma } from '@/lib/prisma';

export type InstantiateResult = {
  object_id: string;
  template_id: string;
  brand_id: string;
  object_type: string;
  payload: any;
  status: 'draft'; 
};

export class BrandPackGenerator {
  
  static async instantiate(template_ids: string[], brand_id: string): Promise<InstantiateResult[]> {
    const results: InstantiateResult[] = [];

    // Ensure brand exists for foreign key
    await prisma.brand.upsert({
      where: { brand_id },
      update: {},
      create: { brand_id, name: `Brand ${brand_id}` }
    });

    for (const tid of template_ids) {
      const template = TemplateRegistry.get(tid);
      if (!template) throw new Error(`Template ${tid} not found`);

      const newId = `OBJ-GEN-${uuidv4().slice(0,8)}`;
      const payloadObj = JSON.parse(JSON.stringify(template.base_payload));

      await prisma.kBeautyObject.create({
        data: {
          object_id: newId,
          brand_id: brand_id,
          template_id: template.template_id,
          object_type: template.object_type,
          canonical_question_id: template.base_payload.canonical_question_id || null,
          status: 'draft',
          payload: JSON.stringify(payloadObj)
        }
      });

      results.push({
        object_id: newId,
        template_id: template.template_id,
        brand_id: brand_id,
        object_type: template.object_type,
        payload: payloadObj,
        status: 'draft'
      });
    }

    return results;
  }

  // Used only in previous unit tests that used mock store, we'll refactor tests too
  static async getStore(brand_id: string) {
    const records = await prisma.kBeautyObject.findMany({ where: { brand_id }});
    return records.map(r => ({
      object_id: r.object_id,
      brand_id: r.brand_id,
      template_id: r.template_id as string,
      payload: JSON.parse(r.payload),
      status: r.status as 'draft'
    }));
  }
}

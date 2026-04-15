import { TemplateRegistry } from "./template-registry";
import { prisma } from '@/lib/prisma';

export class OverrideManager {
  
  static async applyOverride(object_id: string, overrides: Record<string, any>) {
    const record = await prisma.kBeautyObject.findUnique({ where: { object_id } });
    if (!record) throw new Error("Object not found in DB");
    if (!record.template_id) throw new Error("Object lacks template_id linkage");

    const template = TemplateRegistry.get(record.template_id);
    if (!template) throw new Error("Template reference missing");

    const objPayload = JSON.parse(record.payload);

    // Pre-scan: Prevent bypassing invariant by overriding the parent object
    for (const key of Object.keys(overrides)) {
      if (template.rules[key] === 'invariant') {
        throw new Error(`FORBIDDEN_OVERRIDE: The field '${key}' is invariant.`);
      }
      const invariantChildren = Object.keys(template.rules).filter(r => 
        template.rules[r] === 'invariant' && r.startsWith(`${key}.`)
      );
      if (invariantChildren.length > 0) {
        throw new Error(`FORBIDDEN_OVERRIDE: Cannot override parent '${key}' because it contains invariant children.`);
      }
    }

    for (const key of Object.keys(overrides)) {
      const rule = template.rules[key];
      if (rule === 'overridable' || !rule) {
        if (key.includes('.')) {
          const parts = key.split('.');
          if (parts.length === 2 && objPayload[parts[0]]) {
            objPayload[parts[0]][parts[1]] = overrides[key];
          }
        } else {
          objPayload[key] = overrides[key];
        }
      }
    }

    await prisma.kBeautyObject.update({
      where: { object_id },
      data: { payload: JSON.stringify(objPayload) }
    });

    return { ...record, payload: objPayload };
  }

  static async getDiff(object_id: string) {
    const record = await prisma.kBeautyObject.findUnique({ where: { object_id } });
    if (!record) throw new Error("Object not found");
    if (!record.template_id) throw new Error("Object lacks template linkage");

    const template = TemplateRegistry.get(record.template_id);
    if (!template) throw new Error("Template reference missing");

    const diff: Record<string, { base: any, current: any }> = {};
    const payload = JSON.parse(record.payload);
    const base = template.base_payload;

    for (const key of Object.keys(payload)) {
      if (key === 'fit_summary') {
        if (JSON.stringify(payload[key]) !== JSON.stringify(base[key])) {
          diff[key] = { base: base[key], current: payload[key] };
        }
      } else {
        if (payload[key] !== base[key]) {
          diff[key] = { base: base[key], current: payload[key] };
        }
      }
    }

    return diff;
  }
}

'use server';

import { QISSceneService } from '@/domain/qis-scene';

export async function upsertQISSceneAction(data: any) {
  try {
    const result = await QISSceneService.upsert(data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

'use server';

import { QISAIClusterer } from '@/domain/qis/ai-cluster';
import { AIBundleGenerator } from '@/domain/brand/ai-bundle-gen';

export async function runGeminiBundleGenAction(intent: string, brandContext: string, knowledgeFiles: string[]) {
  try {
    const results = await AIBundleGenerator.generateBundleDraft(intent, brandContext, knowledgeFiles);
    return { success: true, data: results };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

export async function runGeminiClusteringAction(rawQuestions: any[]) {
  try {
    const results = await QISAIClusterer.clusterRawQuestions(rawQuestions);
    return { success: true, data: results };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

export async function runGeminiSceneGenerationAction(canonicalIntent: string) {
  try {
    const results = await QISAIClusterer.generateScenesForCQ(canonicalIntent);
    return { success: true, data: results };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

import { CanonicalQuestionService } from '@/domain/canonical-question';

export async function createCanonicalQuestionAction(data: any) {
  try {
    const result = await CanonicalQuestionService.upsert(data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

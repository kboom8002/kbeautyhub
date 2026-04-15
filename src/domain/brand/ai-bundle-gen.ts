import { GoogleGenAI } from '@google/genai';

// Initialize the SDK.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "mock-key" });

export class AIBundleGenerator {
  
  static async generateBundleDraft(intent: string, brandContext: string, knowledgeFiles: string[]) {
    if (!process.env.GEMINI_API_KEY) {
      // Mock Fallback for Visual End-to-End Testing without API Key
      console.warn("GEMINI_API_KEY missing. Using Mock Bundle Generation...");
      await new Promise(r => setTimeout(r, 2000));
      
      let proofText = "[Grade None] No evidence provided.";
      if (knowledgeFiles.some(f => f.includes("임상 리포트"))) {
         proofText = "[Grade A] 한국피부과학연구원 2차 저자극 테스트 무자극 판정 완료 (2025). 모든 성분 EWG Green.";
      }

      return {
        answer: `네, 저희 ${brandContext} 브랜드의 제품은 예민한 시기에도 편안하게 사용할 수 있도록 설계되었습니다. 특히 우려하시는 성분들을 배제하여 안전합니다.`,
        proof: proofText,
        action: "commerce_primary" // action route fallback
      };
    }

    const payloadText = JSON.stringify(knowledgeFiles);

    const prompt = `You are a high-end K-Beauty brand representative for "\${brandContext}".
    You need to answer the customer's canonical intent: "\${intent}".
    
    You must base your answer strictly on the following RAG Knowledge Context:
    \${payloadText}
    
    Task: Draft the 3 objects required by the platform.
    1. answer: A warm, clear text answer.
    2. proof: A clinical evidence statement based ONLY on the provided knowledge files. If no evidence applies, state [Grade None].
    3. action: Select one of [commerce_primary, consult_gate_fallback, consult_strict] depending on the safety profile needed.
    
    Return ONLY a highly-structured JSON object, no markdown codeblocks, following this exact schema:
    {
      "answer": "Yes, our...",
      "proof": "[Grade A] ...",
      "action": "commerce_primary"
    }`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text || "{}";
      return JSON.parse(responseText);
    } catch (e) {
      console.error("AI Bundle Gen Failed", e);
      throw e;
    }
  }
}

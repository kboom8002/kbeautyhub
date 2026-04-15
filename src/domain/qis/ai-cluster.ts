import { GoogleGenAI } from '@google/genai';

// Initialize the SDK.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "mock-key" });

export class QISAIClusterer {
  
  static async clusterRawQuestions(rawQuestions: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      // **Mock Fallback for Visual End-to-End Testing without API Key**
      console.warn("GEMINI_API_KEY missing. Using Mock Clustering...");
      await new Promise(r => setTimeout(r, 1500)); // simulate network latency
      return [
        {
          proposed_id: 'CQ-FIT-PREGNANCY-AI',
          canonical_intent: 'Is this product safe to use during pregnancy?',
          category: 'Fit & Suitability',
          matched_raw_count: 2,
          matched_raw_samples: ["Can pregnant women use this?", "Is it safe during pregnancy?"]
        },
        {
          proposed_id: 'CQ-RTN-VITC-AI',
          canonical_intent: 'Can this be safely combined with Vitamin C or Retinol?',
          category: 'Routine & Synergy',
          matched_raw_count: 2,
          matched_raw_samples: ["Can I use vitamin C with this?", "Mix with retinol?"]
        }
      ];
    }

    const payloadText = JSON.stringify(rawQuestions.map(q => q.text));

    const prompt = `
    You are an expert K-Beauty Ontologist.
    I have a list of raw, messy customer questions about skincare.
    Cluster these questions into concise, standardized "Canonical Intents" (QIS).
    Return ONLY a highly-structured JSON array of objects, with no markdown codeblocks, following this exact schema:
    [
      {
        "proposed_id": "CQ-FIT-...",
        "canonical_intent": "The standardized question...",
        "category": "Fit & Suitability", // or "Proof & Evidence" or "Routine & Synergy"
        "matched_raw_count": 2, // how many of the inputted raw questions belong here
        "matched_raw_samples": ["sample 1", "sample 2"]
      }
    ]

    Raw Questions to Cluster:
    ${payloadText}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text || "[]";
      return JSON.parse(responseText);
    } catch (e) {
      console.error("AI Clustering Failed", e);
      throw e;
    }
  }

  static async generateScenesForCQ(canonicalIntent: string) {
    if (!process.env.GEMINI_API_KEY) {
      // Mock Fallback
      console.warn("GEMINI_API_KEY missing. Using Mock Scene Generation...");
      await new Promise(r => setTimeout(r, 1500));
      return [
        {
          id: "QIS-AI-" + Math.floor(Math.random() * 1000),
          title: "Safety verification and allergy concern",
          risk: "High",
          intent: "safety",
          reqObjects: { answer: true, proof: true, boundary: true, action: false }
        },
        {
          id: "QIS-AI-" + Math.floor(Math.random() * 1000),
          title: "General usage inquiry before purchase",
          risk: "Low",
          intent: "discover",
          reqObjects: { answer: true, proof: false, boundary: false, action: true }
        }
      ];
    }

    const prompt = `You are an expert K-Beauty Ontologist and system governor.
    Given a standardized Customer Canonical Question: "${canonicalIntent}", 
    derive 2 highly realistic "Scenes" (Contexts/Scenarios) that prompt this question.
    
    Guardrail: If the question involves pregnancy, medical conditions, ingredients mixing, side effects, or safety, you MUST flag risk="High" and set reqObjects boundary=true and proof=true.

    Return ONLY a highly-structured JSON array of objects, with no markdown codeblocks, following this exact schema:
    [
      {
        "id": "QIS-AI-001",
        "title": "A short descriptive scene name (e.g. 민감성 피부 임산부 사전 점검)",
        "risk": "High or Low",
        "intent": "safety or fit or discover",
        "reqObjects": {
          "answer": true,
          "proof": true or false,
          "boundary": true or false,
          "action": true or false
        }
      }
    ]`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text || "[]";
      return JSON.parse(responseText);
    } catch (e) {
      console.error("AI Scene Gen Failed", e);
      throw e;
    }
  }
}

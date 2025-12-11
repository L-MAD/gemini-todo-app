import { GoogleGenAI, Type } from "@google/genai";

// We use the environment variable for the API key as per instructions.
// If not present, the feature will gracefully degrade.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface BreakdownResponse {
  subtasks: string[];
}

export const breakdownTask = async (taskTitle: string): Promise<string[]> => {
  if (!ai) {
    throw new Error("API Key is missing. Cannot use AI features.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the following task into 3 to 5 actionable subtasks. Keep them concise (under 50 chars each). Task: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of subtasks"
            }
          },
          required: ["subtasks"]
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = JSON.parse(text) as BreakdownResponse;
    return parsed.subtasks || [];
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate subtasks using AI.");
  }
};
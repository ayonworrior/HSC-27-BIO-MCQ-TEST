
import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, MCQ, CQ } from "../types";

export const generateQuestions = async (
  chapter: Chapter,
  mcqCount: number,
  isHardMode: boolean
): Promise<{ mcqs: MCQ[]; cqs: CQ[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mcqSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        question: { type: Type.STRING },
        options: {
          type: Type.OBJECT,
          properties: {
            A: { type: Type.STRING },
            B: { type: Type.STRING },
            C: { type: Type.STRING },
            D: { type: Type.STRING },
          },
          required: ["A", "B", "C", "D"]
        },
        correctAnswer: { type: Type.STRING, description: "Must be exactly 'A', 'B', 'C', or 'D'" },
        difficulty: { type: Type.STRING, description: "Must be exactly 'Easy', 'Medium', or 'Hard' (Case-sensitive)" },
        explanation: { type: Type.STRING },
        topicTag: { type: Type.STRING },
        estimatedTime: { type: Type.STRING },
      },
      required: ["id", "question", "options", "correctAnswer", "difficulty", "explanation", "topicTag", "estimatedTime"]
    }
  };

  const cqSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        stimulus: { type: Type.STRING },
        questions: {
          type: Type.OBJECT,
          properties: {
            a: { type: Type.STRING },
            b: { type: Type.STRING },
            c: { type: Type.STRING },
            d: { type: Type.STRING },
          },
          required: ["a", "b", "c", "d"]
        },
        answers: {
          type: Type.OBJECT,
          properties: {
            a: { type: Type.STRING },
            b: { type: Type.STRING },
            c: { type: Type.STRING },
            d: { type: Type.STRING },
          },
          required: ["a", "b", "c", "d"]
        },
        marks: { type: Type.NUMBER },
        topicTag: { type: Type.STRING },
        estimatedTime: { type: Type.STRING },
      },
      required: ["id", "stimulus", "questions", "answers", "marks", "topicTag", "estimatedTime"]
    }
  };

  const systemInstruction = `You are a world-class HSC Biology teacher for the 2027 syllabus. 
  Source: Abul Hasan's "Biology 1st Paper".
  
  IMPORTANT RULES:
  1. All Bengali text must use standard academic terminology.
  2. Numbers in JSON MUST be in English digits (0-9).
  3. difficulty MUST be exactly "Easy", "Medium", or "Hard".
  4. Generate exactly ${mcqCount} MCQs and 2 CQs for Chapter ${chapter.id}: ${chapter.name}.
  5. If isHardMode is true, set 80% of MCQs as "Hard".
  6. Return ONLY valid JSON. Avoid markdown blocks if possible, but handle them if necessary.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate MCQ and CQ for Chapter ${chapter.id}: ${chapter.name}. Hard Mode: ${isHardMode}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mcqs: mcqSchema,
            cqs: cqSchema
          },
          required: ["mcqs", "cqs"]
        }
      }
    });

    if (!response.text) throw new Error("No response from AI");
    
    // Clean markdown and normalize Bengali digits to English
    let text = response.text.trim();
    text = text.replace(/^```(?:json)?\s*|\s*```$/g, "");
    const sanitizedText = text.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
    
    const parsed = JSON.parse(sanitizedText);
    
    // Final data normalization
    parsed.mcqs = (parsed.mcqs || []).map((m: any) => ({
      ...m,
      difficulty: m.difficulty ? m.difficulty.charAt(0).toUpperCase() + m.difficulty.slice(1).toLowerCase() : "Easy"
    }));

    parsed.cqs = (parsed.cqs || []).map((cq: any) => ({
      ...cq,
      marks: Number(cq.marks || 10)
    }));

    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

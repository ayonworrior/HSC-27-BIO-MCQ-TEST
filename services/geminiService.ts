import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, MCQ, CQ } from "../types";

export const generateQuestions = async (
  chapter: Chapter,
  mcqCount: number,
  isHardMode: boolean
): Promise<{ mcqs: MCQ[]; cqs: CQ[] }> => {
  // Initialize AI inside the function for better environment variable reliability
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
        difficulty: { type: Type.STRING, description: "Must be exactly 'Easy', 'Medium', or 'Hard'" },
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
  1. All Bengali text must use standard academic terminology from the book.
  2. Numbers in JSON MUST be in English digits (0-9).
  3. Generate exactly ${mcqCount} MCQs and 2 Creative Questions (CQs) for Chapter ${chapter.id}: ${chapter.name}.
  4. If isHardMode is true, ensure questions require high cognitive depth (Application/Higher Order).
  5. Return ONLY valid JSON.`;

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

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Normalize Bengali digits to English to avoid JSON parse errors if any sneak in
    const sanitizedText = text.trim().replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
    const parsed = JSON.parse(sanitizedText);
    
    return parsed;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
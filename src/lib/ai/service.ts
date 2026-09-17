import { z } from "zod";
import { AIProvider, StructuredExtractionResult } from "./provider";
import { GeminiProvider } from "./gemini-provider";

export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    // Default to GeminiProvider if none injected
    this.provider = provider || new GeminiProvider();
  }

  async askCivic(question: string, context: string): Promise<string> {
    const prompt = `
You are CIVIC, a global political and public-data intelligence platform.
Answer the following question using ONLY the provided context. If the context does not contain the answer, say "Data unavailable". Do not invent information.

Context:
${context}

Question:
${question}
`;
    return this.provider.generateText(prompt);
  }

  async extractEntities<T>(text: string, schema: z.ZodSchema<T>): Promise<StructuredExtractionResult<T>> {
    const prompt = `Extract entities from the following text based on the schema.\n\nText:\n${text}`;
    return this.provider.extractStructuredData(prompt, schema);
  }
}

// Singleton export for ease of use in the app
export const aiService = new AIService();

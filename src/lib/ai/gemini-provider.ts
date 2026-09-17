import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { AIProvider, AIProviderOptions, StructuredExtractionResult } from "./provider";

export class GeminiProvider extends AIProvider {
  private ai: GoogleGenAI;
  
  constructor() {
    super();
    // Initialize GenAI sdk
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  protected get defaultModel(): string {
    return "gemini-2.5-flash-lite";
  }

  async generateText(prompt: string, options?: AIProviderOptions): Promise<string> {
    const model = options?.model || this.defaultModel;
    const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            temperature: options?.temperature ?? 0.2,
        }
    });
    
    return response.text || "";
  }

  async extractStructuredData<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: AIProviderOptions
  ): Promise<StructuredExtractionResult<T>> {
    const model = options?.model || this.defaultModel;
    
    try {
        // Instruct Gemini to return JSON
        const fullPrompt = `${prompt}\n\nPlease return ONLY valid JSON that conforms exactly to the required schema. No markdown wrapping.`;
        
        const response = await this.ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                temperature: options?.temperature ?? 0.1,
                responseMimeType: "application/json",
            }
        });
        
        const rawText = response.text || "";
        // Clean markdown if it leaked
        const cleanedText = rawText.replace(/```json\n?|\n?```/g, "").trim();
        
        try {
            const parsedJson = JSON.parse(cleanedText);
            const validatedData = schema.parse(parsedJson);
            return { data: validatedData, rawResponse: cleanedText };
        } catch (parseError: unknown) {
            return { data: null, error: `Validation or Parse Error: ${(parseError as Error).message}`, rawResponse: cleanedText };
        }
    } catch (error: unknown) {
        return { data: null, error: `API Error: ${(error as Error).message}` };
    }
  }
}

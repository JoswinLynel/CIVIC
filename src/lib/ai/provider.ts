import { z } from "zod";

export interface AIProviderOptions {
  model?: string;
  temperature?: number;
}

export interface StructuredExtractionResult<T> {
  data: T | null;
  error?: string;
  rawResponse?: string;
}

export abstract class AIProvider {
  protected abstract get defaultModel(): string;

  /**
   * Generates a plain text response for a given prompt.
   */
  abstract generateText(prompt: string, options?: AIProviderOptions): Promise<string>;

  /**
   * Extracts structured JSON data based on a Zod schema.
   */
  abstract extractStructuredData<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: AIProviderOptions
  ): Promise<StructuredExtractionResult<T>>;
}

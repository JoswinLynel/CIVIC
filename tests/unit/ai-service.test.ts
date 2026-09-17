import { describe, it, expect } from 'vitest';
import { AIService } from '@/lib/ai/service';
import { AIProvider } from '@/lib/ai/provider';

// Mock Provider
class MockProvider extends AIProvider {
  protected get defaultModel() { return "mock-model"; }
  async generateText(prompt: string) { return "mocked response"; }
  async extractStructuredData<T>(prompt: string, schema: unknown): Promise<any> { 
    return { data: { mocked: true }, rawResponse: "{}" };
  }
}

describe('AIService Unit Test', () => {
  it('should initialize with provided AI provider', async () => {
    const mockProvider = new MockProvider();
    const service = new AIService(mockProvider);
    const response = await service.askCivic("test", "test context");
    expect(response).toBe("mocked response");
  });
});

import { describe, it, expect } from 'vitest';
import { ECINormalizer } from '../../../src/lib/ingestion/india/eci/normalizer';
import { ECIParser } from '../../../src/lib/ingestion/india/eci/parser';

describe('ECI Normalizer & Parser', () => {
  it('should parse valid ECI raw data', async () => {
    const raw = {
      id: 'test-1',
      sourceUrl: 'http://example.com',
      sourceType: 'Affidavit',
      retrievalDate: new Date(),
      metadata: {},
      rawContent: {
        election: { name: 'Lok Sabha 2024' },
        constituency: { name: 'Varanasi' },
        party: { name: 'BJP' },
        candidate: { first_name: 'Test', last_name: 'Person' },
        financial_declaration: { currency: 'INR', assets: [] }
      }
    };
    
    const parser = new ECIParser();
    const parsed = await parser.parse(raw);
    
    expect(parsed.election.name).toBe('Lok Sabha 2024');
    expect(parsed.candidate.first_name).toBe('Test');
    
    const normalizer = new ECINormalizer();
    const normalized = await normalizer.normalize(parsed);
    
    expect(normalized.entityType).toBe('person');
    expect(normalized.standardizedFields.party).toBeDefined();
  });

  it('should throw error on missing essential fields', async () => {
    const raw = {
      id: 'test-2',
      sourceUrl: 'http://example.com',
      sourceType: 'Affidavit',
      retrievalDate: new Date(),
      metadata: {},
      rawContent: {
        constituency: { name: 'Varanasi' }
      }
    };
    
    const parser = new ECIParser();
    await expect(parser.parse(raw)).rejects.toThrow('Invalid ECI source data structure');
  });
});

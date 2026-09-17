import { describe, it, expect, vi } from 'vitest';
import { IndiaEntityResolver } from '../../../src/lib/ingestion/india/shared/entity-resolver';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: vi.fn((table: string) => {
        const chain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: table === 'countries' ? { id: 'ind-123' } : null
          }),
          then: function(resolve: any) {
            resolve({ data: table === 'parties' ? [{ id: 'bjp-1', name: 'Bharatiya Janata Party', short_name: 'BJP' }] : null });
          }
        };
        return chain;
      })
    })
  };
});

describe('India Entity Resolver', () => {
  it('should resolve known party with HIGH confidence', async () => {
    const resolver = new IndiaEntityResolver();
    const result = await resolver.resolveParty('BJP');
    expect(result).toEqual({ id: 'bjp-1', matchType: 'HIGH' });
  });

  it('should return null for unknown party', async () => {
    const resolver = new IndiaEntityResolver();
    // Supabase mock will still return the BJP array, but we search for "UNKNOWN"
    const result = await resolver.resolveParty('UNKNOWN PARTY');
    expect(result).toBeNull();
  });
});

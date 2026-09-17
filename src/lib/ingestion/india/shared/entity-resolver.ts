import { EntityResolver, NormalizedData, ResolutionResult } from '../../interfaces';
import { createClient } from '@supabase/supabase-js';

// Server-side admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'fake-key'
);

export class IndiaEntityResolver implements EntityResolver {
  async resolve(normalizedData: NormalizedData, existingEntities: unknown[]): Promise<ResolutionResult> {
    return {
      isMatch: false,
      confidenceScore: 0,
      evidence: []
    };
  }
  
  async resolveParty(name: string): Promise<{ id: string, matchType: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNMATCHED' } | null> {
    const countryId = await this.getIndiaCountryId();
    if (!countryId) return null;
    
    const { data } = await supabase.from('parties').select('id, name, short_name').eq('country_id', countryId);
    if (!data) return null;
    
    const exactMatch = data.find(p => p.name.toLowerCase() === name.toLowerCase() || (p.short_name && p.short_name.toLowerCase() === name.toLowerCase()));
    if (exactMatch) return { id: exactMatch.id, matchType: 'HIGH' };
    
    return null;
  }
  
  async resolvePerson(first: string, last: string): Promise<string | null> {
    const { data } = await supabase.from('people').select('id, first_name, last_name').eq('first_name', first).eq('last_name', last).single();
    return data?.id || null;
  }
  
  private async getIndiaCountryId() {
    const { data } = await supabase.from('countries').select('id').eq('iso3_code', 'IND').single();
    return data?.id;
  }
}

import { EntityResolver, NormalizedData, ResolutionResult } from '../../interfaces';
import { createAdminClient } from '../shared/../../../../utils/supabase/admin'; // src/utils/supabase/admin from src/lib/ingestion/india/shared

// Setup Supabase admin client
const supabase = createAdminClient();

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

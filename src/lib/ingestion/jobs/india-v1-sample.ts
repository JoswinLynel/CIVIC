import { ECIConnector } from '../india/eci/connector';
import { ECIParser } from '../india/eci/parser';
import { ECINormalizer } from '../india/eci/normalizer';
import { IndiaEntityResolver } from '../india/shared/entity-resolver';
import { IngestionJobRunner } from './runner';
import { createClient } from '@supabase/supabase-js';
// Setup Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SECRET_KEY || 'fake-key'
);

async function run() {
  const runner = new IngestionJobRunner('ECI_AFFIDAVIT_FIXTURE');
  console.log('Starting Phase 2: India V1 Sample Ingestion...');
  
  try {
    const connector = new ECIConnector();
    const parser = new ECIParser();
    const normalizer = new ECINormalizer();
    const resolver = new IndiaEntityResolver();
    
    // 1. Fetch Raw Source
    const rawSources = await connector.fetchRawData({ mode: 'fixture' });
    runner.trackProcessed();
    const raw = rawSources[0];
    console.log(`Source retrieved: ${raw.sourceUrl}`);
    
    // 2. Parse
    const parsed = await parser.parse(raw);
    
    // 3. Normalize
    const normalized = await normalizer.normalize(parsed);
    const fields = normalized.standardizedFields;
    
    // 4. Resolve & Insert Idempotently
    
    // Country
    let { data: country } = await supabase.from('countries').select().eq('iso3_code', 'IND').single();
    if (!country) {
      const res = await supabase.from('countries').insert({
        iso2_code: 'IN', iso3_code: 'IND', name: 'India', official_name: 'Republic of India', data_availability_status: 'High'
      }).select().single();
      if (res.error) throw new Error('Country insert error: ' + JSON.stringify(res.error));
      country = res.data;
      runner.trackCreated();
    } else {
      runner.trackSkipped();
    }
    
    // Source
    let { data: source } = await supabase.from('sources').select().eq('url', raw.sourceUrl).single();
    if (!source) {
      const res = await supabase.from('sources').insert({
        country_id: country.id,
        publisher: raw.metadata.publisher,
        title: 'Candidate Affidavit: ' + (fields.candidate as Record<string, string>).first_name,
        url: raw.sourceUrl,
        source_type: raw.sourceType,
        verification_status: raw.metadata.verification_status,
        metadata: { source_mode: raw.metadata.source_mode }
      }).select().single();
      if (res.error) throw new Error('Source insert error: ' + JSON.stringify(res.error));
      source = res.data;
      runner.trackCreated();
    }
    
    // Party
    const partyName = (fields.party as Record<string, string>).name;
    const resolvedParty = await resolver.resolveParty(partyName);
    let partyId = resolvedParty?.id;
    if (!partyId) {
      const res = await supabase.from('parties').insert({
        country_id: country.id,
        name: partyName,
        short_name: (fields.party as Record<string, string>).short_name
      }).select().single();
      if (res.error) throw new Error('Party insert error: ' + JSON.stringify(res.error));
      partyId = res.data.id;
      runner.trackCreated();
    }
    
    // Constituency
    const constName = (fields.constituency as Record<string, string>).name;
    let { data: constituency } = await supabase.from('constituencies').select().eq('name', constName).single();
    if (!constituency) {
      const res = await supabase.from('constituencies').insert({
        country_id: country.id,
        name: constName,
        region: (fields.constituency as Record<string, string>).region
      }).select().single();
      if (res.error) throw new Error('Constituency insert error: ' + JSON.stringify(res.error));
      constituency = res.data;
      runner.trackCreated();
    }
    
    // Person
    const cData = fields.candidate as Record<string, string>;
    let personId = await resolver.resolvePerson(cData.first_name, cData.last_name);
    if (!personId) {
      const res = await supabase.from('people').insert({
        first_name: cData.first_name,
        middle_name: cData.middle_name,
        last_name: cData.last_name,
        full_name: `${cData.first_name} ${cData.middle_name ? cData.middle_name + ' ' : ''}${cData.last_name}`,
        nationality_country_id: country.id
      }).select().single();
      if (res.error) throw new Error('Person insert error: ' + JSON.stringify(res.error));
      personId = res.data.id;
      runner.trackCreated();
    }
    
    // Politician
    let { data: politician } = await supabase.from('politicians').select().eq('person_id', personId).single();
    if (!politician) {
      const res = await supabase.from('politicians').insert({
        person_id: personId,
        country_id: country.id,
        current_party_id: partyId
      }).select().single();
      if (res.error) throw new Error('Politician insert error: ' + JSON.stringify(res.error));
      politician = res.data;
      runner.trackCreated();
    }
    
    // Financial Declaration
    const finData = fields.financial_declaration as { declaration_date: string, currency: string, assets?: Record<string, unknown>[] } & Record<string, unknown>;
    let { data: declaration } = await supabase.from('financial_declarations').select().eq('politician_id', politician.id).eq('declaration_date', finData.declaration_date).single();
    if (!declaration) {
      const res = await supabase.from('financial_declarations').insert({
        politician_id: politician.id,
        source_id: source.id,
        declaration_date: finData.declaration_date,
        currency: finData.currency
      }).select().single();
      if (res.error) throw new Error('Financial declaration insert error: ' + JSON.stringify(res.error));
      declaration = res.data;
      runner.trackCreated();
      
      // Assets
      if (finData.assets && finData.assets.length > 0) {
        const assetsToInsert = finData.assets.map((a: Record<string, unknown>) => ({
          declaration_id: declaration.id,
          asset_type: a.asset_type,
          description: a.description,
          declared_value: a.declared_value
        }));
        await supabase.from('assets').insert(assetsToInsert);
      }
    }
    
    console.log('Vertical slice ingestion complete.', await runner.complete());
  } catch (err) {
    console.error('Ingestion failed.', err);
    await runner.fail(err);
  }
}

if (require.main === module) {
  run();
}

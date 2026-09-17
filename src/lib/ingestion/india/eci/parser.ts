import { Parser, RawSource } from '../../interfaces';

export interface ParsedECIRecord {
  election: Record<string, unknown>;
  constituency: Record<string, unknown>;
  party: Record<string, unknown>;
  candidate: Record<string, unknown>;
  financial_declaration: Record<string, unknown>;
  rawSource: RawSource;
}

export class ECIParser implements Parser<ParsedECIRecord> {
  async parse(rawSource: RawSource): Promise<ParsedECIRecord> {
    const data = rawSource.rawContent as any;
    if (!data.election || !data.candidate) {
      throw new Error('Invalid ECI source data structure: missing election or candidate');
    }
    
    return {
      election: data.election,
      constituency: data.constituency,
      party: data.party,
      candidate: data.candidate,
      financial_declaration: data.financial_declaration,
      rawSource
    };
  }
}

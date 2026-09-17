import { Normalizer, NormalizedData } from '../../interfaces';
import { ParsedECIRecord } from './parser';

export class ECINormalizer implements Normalizer<ParsedECIRecord> {
  async normalize(parsedData: ParsedECIRecord): Promise<NormalizedData> {
    return {
      id: parsedData.rawSource.id,
      entityType: 'person',
      sourceId: parsedData.rawSource.id,
      confidenceScore: 1.0,
      standardizedFields: {
        election: parsedData.election,
        constituency: parsedData.constituency,
        party: parsedData.party,
        candidate: parsedData.candidate,
        financial_declaration: parsedData.financial_declaration,
      }
    };
  }
}

import { DataConnector, RawSource } from '../../interfaces';
import * as fs from 'fs';
import * as path from 'path';

export class ECIConnector implements DataConnector {
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  
  async fetchRawData(params: Record<string, unknown>): Promise<RawSource[]> {
    if (params.mode === 'fixture') {
      const fixturePath = path.join(process.cwd(), 'src/lib/ingestion/india/eci/fixtures/sample-affidavit.json');
      const rawContent = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
      
      return [{
        id: rawContent.meta.source_url,
        sourceUrl: rawContent.meta.source_url,
        sourceType: rawContent.meta.source_type,
        retrievalDate: new Date(rawContent.meta.retrieved_at),
        rawContent: rawContent.data,
        metadata: {
          publisher: rawContent.meta.publisher,
          verification_status: rawContent.meta.verification_status,
          source_mode: rawContent.meta.source_mode
        }
      }];
    }
    throw new Error('Live mode not yet implemented. Please use fixture mode for Phase 2 sample.');
  }
}

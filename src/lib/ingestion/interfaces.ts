export interface RawSource {
  id: string;
  sourceUrl: string;
  sourceType: string;
  publicationDate?: Date;
  retrievalDate: Date;
  rawContent: unknown;
  metadata: Record<string, unknown>;
}

export interface NormalizedData {
  id: string;
  entityType: 'person' | 'company' | 'organisation' | 'event' | 'document';
  standardizedFields: Record<string, unknown>;
  sourceId: string;
  confidenceScore: number;
}

export interface ProvenanceRecord {
  id: string;
  entityId: string;
  sourceId: string;
  verificationStatus: 'Unverified' | 'Verified' | 'Disputed';
  licenseMetadata?: Record<string, unknown>;
  extractedAt: Date;
}

export interface DataConnector {
  connect(): Promise<void>;
  fetchRawData(params: Record<string, unknown>): Promise<RawSource[]>;
  disconnect(): Promise<void>;
}

export interface Parser<T> {
  parse(rawSource: RawSource): Promise<T>;
}

export interface Normalizer<T> {
  normalize(parsedData: T): Promise<NormalizedData>;
}

export interface Validator {
  validate(normalizedData: NormalizedData): Promise<{ isValid: boolean; errors?: string[] }>;
}

export interface MatchEvidence {
  field: string;
  sourceValue: unknown;
  targetValue: unknown;
  similarityScore: number;
}

export interface ResolutionResult {
  isMatch: boolean;
  confidenceScore: number;
  matchedEntityId?: string;
  evidence: MatchEvidence[];
}

export interface EntityResolver {
  resolve(normalizedData: NormalizedData, existingEntities: unknown[]): Promise<ResolutionResult>;
}

export interface ProvenanceHandler {
  recordProvenance(normalizedData: NormalizedData, resolutionResult: ResolutionResult): Promise<ProvenanceRecord>;
}

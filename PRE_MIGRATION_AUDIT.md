# CIVIC — Pre-Migration Database Audit

## 1. Migration Table Count & Structure
- **Tables Created**: Exactly 48 tables.
- **Foreign Keys**: Intact. All tables appropriately reference core entity and provenance tables (e.g. `source_id UUID REFERENCES sources(id)`).
- **Triggers**: `update_updated_at_column` is correctly applied to all primary tables.

## 2. Extension Requirements & pgvector Status
- **Current Status**: The vector extension is explicitly created via `CREATE EXTENSION IF NOT EXISTS vector;` (Line 2). 
- **Assessment**: Safe, but slightly sub-optimal for Supabase. By default this creates the extension in the `public` schema. Supabase best practices recommend installing managed extensions into the `extensions` schema: `CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;`.
- **Note**: Modifying it to `WITH SCHEMA extensions` requires qualifying the vector type references (e.g., `extensions.vector(768)`) later in the script or adding it to the `search_path`.

## 3. RAG/Vector Assessment
- **Schema**: `ai_documents`, `ai_chunks`, `ai_embeddings`, and `ai_answers` are all included.
- **Types**: `embedding vector(768)` is correctly defined on `ai_embeddings`.
- **Indexes**: `idx_ai_embeddings_vector ON ai_embeddings USING hnsw (embedding vector_cosine_ops)` is correctly structured.
- **Assessment**: Correct and ready.

## 4. Destructive-Operation Assessment
- **Status**: **SAFE**. 
- The migration contains 0 `DROP TABLE`, `DROP COLUMN`, or `TRUNCATE` statements. It is strictly additive.

## 5. RLS & Security Assessment
- **Status**: **HIGHLY SECURE**.
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` is applied to all 48 tables.
- 12 tables explicitly allow public read access (`SELECT USING (true)`).
- **Zero public write policies exist**, guaranteeing that any data seeding or scraping must be performed strictly via the trusted server environment using the `SUPABASE_SECRET_KEY`.

## 6. Idempotency & Phase 2 Defect Assessment
- **Status**: **BLOCKED (Requires Modification before Push)**.
- **Unique Constraints**: The schema completely lacks database-level `UNIQUE` constraints for core logical entities. 
  - `people` needs a unique constraint on something like `(full_name, date_of_birth, nationality_country_id)` or `(full_name, metadata->>'alias')`.
  - `politicians` needs a unique constraint on `(person_id, country_id)`.
  - `sources` lacks a unique constraint to prevent duplicate ingestion of the exact same document/url.
- Without these `UNIQUE` constraints, the ingestion architecture cannot use robust `INSERT ... ON CONFLICT DO NOTHING` statements, leaving the application highly vulnerable to race conditions and duplicate records.
- **Entity Resolution**: `people` lacks formal alias structures, relying purely on the `metadata` JSONB blob, which degrades exact-match idempotency.

## 7. Build & Test Verification
- **TypeScript**: `tsc --noEmit` passed.
- **Lint**: Passed (only structural warnings remain).
- **Unit Tests**: Passed (6/6 tests).
- **Build**: Passed statically.

## Final Status
**BLOCKED**

**Reason:** Applying this schema directly to production will instantly create an architecture that is not resilient to duplicate ingestion. The lack of `UNIQUE` constraints on core entity tables (`people`, `politicians`, `parties`, `sources`) is a critical flaw that must be fixed in the `initial_schema.sql` file before it is pushed to the remote `ksvaurcliibnpcngklli` instance.

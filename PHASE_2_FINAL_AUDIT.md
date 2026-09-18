# Phase 2 Final Audit

## Executive Summary
This document provides a strict, factual, code-level audit of the CIVIC Phase 2 India V1 implementation. The codebase was inspected, the ingestion script was executed, and the testing suite was run against the actual repository state. While the foundational architecture exists, several components are partially implemented, and the lack of a running local database prevented live idempotency verification.

## 1. Ingestion Pipeline
**Status: PARTIALLY IMPLEMENTED**
Data does flow through the pipeline, but the separation of concerns is incomplete.
- **Connector**: Implemented (Fixture mode only).
- **Parser**: Implemented.
- **Normalizer**: Implemented.
- **Validator**: **Missing**. There is no explicit validation layer (e.g., Zod) running between the normalizer and the database.
- **Entity Resolution**: Partially implemented. The class exists but is stubbed.
- **Provenance**: Partially implemented. `src/lib/ingestion/india/shared/provenance.ts` exists but is completely unused by the runner. The runner manually maps `source.id`.
- **Database write layer**: Implemented inside `india-v1-sample.ts`.
- **Job runner**: Implemented.

## 2. Synthetic Fixture
**Status: IMPLEMENTED**
- The fixture (`sample-affidavit.json`) is clearly synthetic.
- It contains explicit `source_mode: "fixture"` and `verification_status: "synthetic_test_data"` metadata flags.
- The ingestion runner correctly maps these flags to the production database, preventing it from being treated as official ECI data.

## 3. Idempotency
**Status: COULD NOT BE VERIFIED (CODE ONLY)**
- **Actual execution**: The ingestion script (`india-v1-sample.ts`) was executed but immediately failed with `AggregateError [ECONNREFUSED]`. No local Supabase database instance is running, so the data flow into the database could not be verified.
- **Code Inspection**: The runner checks for existing records using `.eq().single()` before performing an `.insert()`. However, because the underlying database schema lacks explicit `UNIQUE` constraints on many of these fields (e.g., `constituencies.name`, `parties.name`), true idempotency is vulnerable to race conditions.

## 4. Entity Resolution
**Status: PARTIALLY IMPLEMENTED (STUBBED)**
- **Exact matching**: Implemented. The `IndiaEntityResolver` checks for exact name matches against the database.
- **Alias / Fuzzy matching**: **Missing**. No similarity calculation or fuzzy logic exists.
- **Thresholds**: **Missing**.
- **HIGH/MEDIUM/LOW/UNMATCHED behaviour**: The resolver only returns `HIGH` for exact matches and `null` for everything else. Because it conservatively defaults to `null`, it will safely create new records rather than accidentally merge entities via LOW-confidence matches.

## 5. Provenance
**Status: PARTIALLY IMPLEMENTED**
- **source_id**: Mapped correctly.
- **publisher**: Mapped correctly.
- **source_url**: Mapped correctly.
- **source_type**: Mapped correctly.
- **verification_status**: Mapped correctly.
- **retrieved_at**: **Missing**. The `india-v1-sample.ts` runner completely omits the `retrieved_at` field during the `sources` table insert (line 54). It defaults to the database's `now()`, destroying the actual retrieval provenance of the source document.

## 6. Financial Data
**Status: IMPLEMENTED**
- The UI (`/politicians/[id]/page.tsx`) explicitly renders "CIVIC CALCULATED NET DECLARED POSITION".
- It distinguishes between declared assets and liabilities.
- It completely avoids using the generic and potentially misleading term "Net Worth".

## 7. Security
**Status: IMPLEMENTED**
- **RLS**: Remains enabled on all tables (verified in `20260917000000_initial_schema.sql`).
- **Service Role**: `SUPABASE_SECRET_KEY` is strictly used server-side (`page.tsx` async fetch and Node script).
- **No secrets committed**: Only `.env.example` exists. 

## 8. Database
**Status: PARTIALLY IMPLEMENTED**
- Foreign keys and nullability are correctly defined.
- **Duplicate Protection**: **Missing**. While the application code checks for duplicates, the schema lacks necessary `UNIQUE` constraints (aside from country codes) to enforce data integrity at the database layer.

## 9. UI
**Status: IMPLEMENTED**
- `/countries/india` and `/politicians/[id]` are wired to fetch from the database using server components.
- Empty states are handled (`<p className="text-slate-500 italic">No politicians available.</p>`).
- `<CivicSource>` correctly receives and renders the source provenance.

## 10. Testing
**Status: PARTIALLY IMPLEMENTED (LINTING FAILS)**
Exact execution results:
- `npm run lint`: **FAILED** (22 errors, mostly `Unexpected any. Specify a different type`).
- `npm run typecheck`: PASSED.
- `npm test` (Vitest): **PASSED** (6 unit tests executed successfully).
- `npm run build`: **PASSED** (Static pages generated in 21.6s).

## 11. Live ECI Status
**Status: SCAFFOLDED / NOT IMPLEMENTED**
- A live connector to the ECI portal does not exist. 
- `ECIConnector` only processes the `fixture` mode. Requesting live data throws an explicit error: `"Live mode not yet implemented."`

## 12. Documentation
**Status: INFLATED / PARTIALLY ACCURATE**
- `INDIA_V1_IMPLEMENTATION_REPORT.md` claims tests passed but omits that the linter is currently failing.
- Documentation claims idempotency and provenance are complete, but misses the schema-level `UNIQUE` constraint risks and the omitted `retrieved_at` field during insertion.

---

## Confirmed Implemented
- Next.js UI routing and Server Component data fetching.
- Financial data classification privacy ("Calculated Net Declared Position").
- Synthetic fixture metadata isolation.
- Security and RLS persistence.

## Partially Implemented
- Ingestion pipeline (missing validation step, missing `retrieved_at` mapping).
- Entity Resolution (only supports exact match).
- Testing (linter failing due to aggressive use of `any`).
- Database Integrity (missing `UNIQUE` constraints).

## Missing
- Live ECI Web Scraper.
- E2E Playwright tests.
- Local Database execution environment.

## Risks
1. **Duplicate Data**: Without `UNIQUE` constraints in Postgres, concurrent ingestion runs will bypass the application-level idempotency checks and create duplicate politicians/parties.
2. **Type Safety**: The heavy use of `any` in the ingestion pipeline undermines the parser's type safety and causes linter failures.
3. **Loss of Provenance**: The failure to map `retrieved_at` into the `sources` table means historical data drops its original timestamp in favor of the ingestion runtime timestamp.

## Recommended Phase 2B Changes
1. **Database Constraints**: Add a migration enforcing `UNIQUE` constraints on entity names/combinations (e.g., `UNIQUE(first_name, last_name, date_of_birth)`).
2. **Fix Linting**: Remove `any` types from `india-v1-sample.ts` and `page.tsx` by defining proper Zod/TypeScript interfaces.
3. **Fix Provenance**: Update the ingestion script to map `raw.retrievalDate` to the `sources.retrieved_at` database column.
4. **Local DB Strategy**: Resolve the `ECONNREFUSED` error by provisioning a functional local test database or mocking the DB connection in integration tests.

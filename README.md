# CIVIC: Global Political & Public-Data Intelligence Platform

CIVIC is a modern intelligence platform designed to ingest, resolve, and analyze complex global political, financial, legal, and power metrics. The platform brings Bloomberg-style intelligence and a premium dark UI to public data, ensuring transparency, robust provenance, and powerful AI-driven insights.

## Architecture & Technology Stack

CIVIC is built on a highly scalable, modern stack:

*   **Frontend & API**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) using a custom premium dark UI design system.
*   **Database**: [Supabase](https://supabase.com/) / PostgreSQL
*   **Vector Search**: `pgvector` for embedding storage and similarity search
*   **AI Engine**: Gemini 2.5 Flash-Lite (via `@google/genai`)
*   **Validation**: Zod for structured extraction and input validation

## Core Systems

### 1. AI Abstraction & RAG Architecture
The platform isolates AI interactions through a clean `AIService -> AIProvider -> GeminiProvider` abstraction layer, keeping API calls entirely server-side.
The Retrieval-Augmented Generation (RAG) architecture supports raw documents -> chunking -> vector embeddings (`pgvector`) -> contextual retrieval -> Gemini generation -> citations.

### 2. Provenance
Data integrity is critical. Every piece of ingested data traces back to a first-class `sources` entity, tracking the URL, publication/retrieval dates, source type, and verification status to ensure absolute transparency.

### 3. Data Ingestion Architecture
An extensible pipeline is designed to securely process raw data:
`Raw Source -> Parser -> Normalizer -> Validator -> Entity Resolution -> Provenance -> Database`
Each pipeline stage is strictly typed and independently testable.

### 4. Entity Resolution
CIVIC includes an architectural foundation for matching and disambiguating entities (people, politicians, companies, etc.) based on names, aliases, dates, and other identifiers, incorporating confidence scoring and evidence tracking.

## Development & Local Setup

### Environment Variables
Copy `.env.example` to `.env.local` and populate the required keys:
```bash
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
*Note: Service role keys and Gemini keys must never be exposed to the client.*

### Database Migrations
Migrations are stored in `supabase/migrations/`. 
To apply the initial schema (which configures the 48 core tables and RLS):
```bash
# Using Supabase CLI
supabase start
supabase db push
```

### Installation & Execution
```bash
npm install
npm run dev
```

## Testing & CI/CD
The project uses Vitest for unit/integration testing and Playwright for E2E testing.
*   `npm test` - Run unit and integration tests.
*   `npm run test:e2e` - Run Playwright smoke tests.

Continuous Integration is enforced via GitHub Actions (`.github/workflows/ci.yml`), which automatically runs `npm ci`, typechecking, linting, tests, and a production build (`npm run build`) on every push to main.

## Roadmap

### India V1
The first targeted data rollout will be India V1. Connectors will be built specifically for Indian political, financial, and electoral data, utilizing the ingestion architecture.

### Future Global Country Expansion
The schema inherently supports global expansion through the `countries` foundational table. Once India V1 is stable, the ingestion layer will scale to support worldwide political and power metrics.

## Deployment
The Next.js application is designed for seamless deployment on Vercel, with Supabase serving as the managed PostgreSQL database. All environment variables must be securely configured in the deployment environment.

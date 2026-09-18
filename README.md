# CIVIC

### Global Political & Public Data Intelligence

CIVIC is an evidence-driven political and public-data intelligence platform designed to make complex government, political, financial, electoral, legal, and geopolitical information easier to explore, understand, and research.

Starting with **India**, CIVIC is being built with a global architecture so additional countries can be added without rebuilding the platform.

> **CIVIC does not tell people what to think. It helps them understand the evidence.**

---

## Overview

Political and public information is spread across thousands of government portals, election databases, parliamentary records, financial disclosures, court documents, company registries, and news sources.

CIVIC brings these sources together into a structured, connected intelligence layer.

The platform aims to answer questions such as:

- Who is this politician?
- What political positions have they held?
- Which party are they associated with?
- What constituency do they represent?
- What elections have they participated in?
- What assets and liabilities have they declared?
- Which companies or organisations are connected to them?
- What parliamentary activity is publicly documented?
- What investigations or legal proceedings are documented?
- What relationships exist between people, organisations, and political entities?
- What does the available evidence actually show?

CIVIC combines structured public data, source provenance, relationship graphs, search, document analysis, and AI-assisted research.

---

# Core Principles

### Evidence First

Official and public sources are the foundation of CIVIC.

AI is used to help interpret and navigate information, not to replace the underlying evidence.

### Provenance

Important records should be traceable back to their source.

Every supported piece of information should retain information such as:

- Source
- Publisher
- Source URL
- Publication date
- Retrieval date
- Document type
- Country
- Relevant entity
- Data provenance

### Neutrality

CIVIC is designed as an information and research platform.

It does not:

- Endorse political candidates
- Recommend political parties
- Rank politicians
- Score political actors
- Predict election outcomes
- Tell users how to vote

Documented positions, records, and evidence are presented so users can make their own judgments.

### No Fabricated Data

Unknown information remains unknown.

CIVIC should never manufacture:

- Financial figures
- Political relationships
- Legal outcomes
- Election results
- Personal connections
- Sources
- Citations

### Clear Legal Status

Legal and investigative information must preserve the distinction between:

- Allegation
- Report
- Investigation
- Complaint
- Charge
- Trial
- Conviction
- Acquittal
- Dismissal
- Appeal
- Final outcome

An allegation is not treated as a conviction.

### Financial Transparency

Financial information is represented according to what the source actually supports.

CIVIC distinguishes between:

- Declared
- Calculated
- Estimated
- Unknown

Calculated asset-minus-liability figures are not automatically described as a person's "true net worth."

---

# Product

CIVIC is being designed around several interconnected intelligence layers.

## Politics

Explore:

- Politicians
- Political parties
- Positions
- Political tenures
- Constituencies
- Elections
- Candidates
- Election results
- Parliamentary activity

## Money

Explore publicly documented financial information including:

- Asset declarations
- Liabilities
- Income records
- Political donations
- Company interests
- Corporate relationships
- Financial disclosures

Financial information is presented with its source and classification.

## Power

Explore relationships between:

- People
- Politicians
- Political parties
- Companies
- Organisations
- Government institutions
- Constituencies
- Committees
- Other public entities

The long-term goal is a flexible relationship graph capable of representing complex public relationships.

## Elections

CIVIC will structure election information into reusable entities:

```text
Country
   ↓
Election
   ↓
Constituency
   ↓
Candidate
   ↓
Result
```

This allows historical election data to be explored consistently across countries.

## Investigations & Legal Records

CIVIC can represent publicly documented investigations and legal proceedings while preserving their actual status and source context.

The platform does not independently determine guilt, wrongdoing, or intent.

## News Intelligence

News is treated as an intelligence layer rather than simply a news feed.

The system can associate articles with:

- People
- Companies
- Political parties
- Countries
- Events
- Investigations
- Topics

Where permitted, CIVIC stores metadata and links rather than reproducing copyrighted articles.

---

# AI

CIVIC includes an AI research layer built around **retrieval-augmented generation (RAG)**.

The AI should not act as the source of truth.

Instead:

```text
User Question
      ↓
Intent Detection
      ↓
Structured Database Search
      ↓
Document / Vector Retrieval
      ↓
Evidence
      ↓
AI Reasoning
      ↓
Answer + Sources
```

If CIVIC does not have enough verified evidence to answer a question, the system should say so.

## Ask CIVIC

Users will eventually be able to ask questions such as:

> "Who represents this constituency?"

> "What assets were declared in this affidavit?"

> "Show the political history of this person."

> "What publicly documented companies are connected to this politician?"

> "Summarise the available evidence about this investigation."

Answers should be grounded in retrieved CIVIC records and source documents.

---

# Planned AI Capabilities

### Ask CIVIC

Natural-language questions over CIVIC's verified data.

### AI Search

Search people, organisations, companies, political entities, and documents using natural language.

### Explain

Explain complex political, financial, or legal records using the underlying evidence.

### Timeline

Generate source-backed timelines for people, organisations, or events.

### Compare

Present factual comparisons between entities without producing political rankings or recommendations.

### News Brief

Summarise relevant recent reporting with source attribution.

### Research Mode

Combine multiple records and sources into a structured research response.

### Document Analyst

Extract and explain structured information from supported public documents.

### Relationship Explorer

Explore connections between people, companies, organisations, and political entities.

### Source Checker

Show where information came from and help users inspect the supporting evidence.

---

# India V1

CIVIC's first implementation focuses on **India**.

Initial sources include official public institutions such as:

- Election Commission of India
- ECI Candidate Affidavit Portal
- Digital Sansad

The first data layer focuses on:

- Indian political parties
- Lok Sabha members
- Constituencies
- Elections
- Candidates
- Election results
- Public financial declarations
- Source documents

The implementation will begin with a small verified dataset before expanding.

```text
1 constituency
        ↓
1 party
        ↓
1 politician
        ↓
1 election result
        ↓
1 verified source
        ↓
10 records
        ↓
100 records
        ↓
Full dataset
```

This approach allows the ingestion pipeline and data model to be validated before large-scale ingestion.

---

# Global Architecture

Although India is the first country, CIVIC is designed around a global data model.

```text
                    CIVIC
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     Politics       Money         Power
        │             │             │
        └─────────────┼─────────────┘
                      │
                  Countries
                      │
        ┌─────────────┼─────────────┐
        │             │             │
      India          UK           USA
        │
   More countries
        │
       ...
```

The goal is to add countries incrementally while maintaining a consistent underlying schema.

---

# Data Architecture

CIVIC uses a structured relational model backed by PostgreSQL.

Core entities include:

- Countries
- People
- Politicians
- Political Parties
- Positions
- Political Tenures
- Constituencies
- Elections
- Candidates
- Election Results
- Financial Declarations
- Assets
- Liabilities
- Income Records
- Companies
- Organisations
- Donations
- Parliamentary Activity
- Votes
- Bills
- Speeches
- Questions
- Committees
- Attendance
- News Articles
- Investigations
- Legal Events
- Court Cases
- Sources
- Documents
- AI Documents
- AI Chunks
- AI Embeddings
- AI Answers

---

# Data Ingestion

CIVIC uses a modular ingestion architecture.

```text
Raw Source
    ↓
Parser
    ↓
Normalizer
    ↓
Validator
    ↓
Entity Resolution
    ↓
Provenance
    ↓
PostgreSQL
```

The architecture is designed to support different source types including:

- Government websites
- Public APIs
- CSV files
- PDFs
- Structured datasets
- Public documents

Connectors should respect:

- Terms of service
- Robots.txt where applicable
- Rate limits
- Copyright
- Licensing
- Attribution requirements

---

# Entity Resolution

Public data frequently refers to the same entity in different ways.

For example:

```text
Narendra Modi
Narendra Damodardas Modi
N. Modi
Shri Narendra Modi
```

CIVIC's entity resolution system is designed to determine whether records refer to the same real-world entity.

Matches should retain confidence:

```text
HIGH
MEDIUM
LOW
UNMATCHED
```

Entity resolution must preserve supporting evidence rather than blindly merging records.

---

# Provenance

Sources are a first-class part of the CIVIC data model.

A simplified relationship looks like:

```text
Source
  │
  ├── Person
  ├── Political Record
  ├── Election Result
  ├── Financial Declaration
  ├── Legal Event
  └── News Article
```

This makes it possible to trace important information back to the underlying source.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

## Backend

- Next.js App Router
- Supabase
- PostgreSQL
- PostgreSQL extensions
- pgvector

## AI

- Google Gemini
- Gemini 2.5 Flash-Lite
- `@google/genai`
- Retrieval-Augmented Generation

## Validation

- Zod

## Testing

- Vitest
- React Testing Library
- Playwright

## Infrastructure

- GitHub
- GitHub Actions
- Vercel
- Supabase

---

# AI Architecture

CIVIC uses an AI provider abstraction rather than tightly coupling the application to a single model.

```text
AIService
    │
    └── AIProvider
          │
          └── GeminiProvider
                │
                └── Gemini 2.5 Flash-Lite
```

This allows additional providers to be introduced later without redesigning the application.

---

# Security

Security is a core requirement.

### Environment Secrets

Sensitive credentials remain server-side.

Examples:

```env
GEMINI_API_KEY=

SUPABASE_SECRET_KEY=
```

Public client configuration is kept separate.

### Supabase Row Level Security

RLS is enabled across the database.

The default posture is:

```text
DENY
```

Explicit policies are added only where required.

Public-facing data may be readable where appropriate, while sensitive administrative and AI records remain protected.

### Service Role

The Supabase service-role key must only be used server-side.

It must never be exposed to the browser.

---

# Design System

CIVIC uses a premium dark intelligence aesthetic inspired by:

- Bloomberg Terminal
- Financial intelligence platforms
- Modern luxury interfaces
- High-end data visualisation

### Core palette

```text
Background       #08090A
Primary Surface  #0D0F10
Secondary        #131617
Elevated         #181B1C

Dark Red         #7F1828
Crimson          #B52A3A
Alert Red        #D64550

Emerald          #13A36B
Bright Green     #22C783

Ivory            #F2EFE7
Muted Grey       #858B88
Gold             #C5A66A
```

The interface prioritises:

- Dense information
- Strong typography
- Clear hierarchy
- Data visualisation
- Timelines
- Relationship graphs
- Maps
- Tables
- Subtle animation
- Minimal visual noise

---

# Project Structure

```text
civic/
├── .github/
│   └── workflows/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── politics/
│   │   ├── money/
│   │   ├── power/
│   │   ├── countries/
│   │   ├── people/
│   │   ├── politicians/
│   │   ├── companies/
│   │   ├── news/
│   │   ├── investigations/
│   │   ├── connections/
│   │   ├── research/
│   │   └── ask/
│   │
│   ├── components/
│   │
│   └── lib/
│       ├── ai/
│       ├── db/
│       ├── ingestion/
│       └── provenance/
│
├── supabase/
│   └── migrations/
│
├── tests/
│
├── .env.example
├── AGENTS.md
├── CLAUDE.md
├── package.json
└── README.md
```

---

# Getting Started

## Requirements

- Node.js
- npm
- Supabase project
- Google Gemini API key

## Clone

```bash
git clone https://github.com/YOUR_USERNAME/civic.git
cd civic
```

## Install

```bash
npm install
```

## Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add the required credentials:

```env
GEMINI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Never commit `.env.local`.

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Database

CIVIC uses Supabase migrations for database schema management.

Migrations are stored in:

```text
supabase/migrations/
```

Database changes should be committed as migrations rather than being made only through the Supabase dashboard.

---

# Testing

Run unit and integration tests:

```bash
npm test
```

Run the test suite with coverage where configured:

```bash
npm run test:coverage
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

# Quality Checks

Before submitting changes:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions is used to automate project validation.

---

# Development Roadmap

## Phase 1 — Foundation

- [x] Next.js architecture
- [x] TypeScript
- [x] Supabase
- [x] PostgreSQL schema
- [x] RLS
- [x] Provenance model
- [x] AI abstraction
- [x] Gemini integration foundation
- [x] pgvector schema
- [x] Ingestion interfaces
- [x] Testing foundation
- [x] CI foundation
- [x] Premium design system

## Phase 2 — India V1

- [x] India country record
- [x] Political parties
- [x] Constituencies
- [x] Current Lok Sabha members
- [x] 2024 Lok Sabha election data
- [x] Candidates
- [x] Election results
- [x] Initial financial declaration dataset
- [x] Source verification
- [x] Entity resolution
- [x] India country page
- [x] Politician profiles
- [x] Source explorer
- [x] End-to-end India data flow

## Phase 3 — India Intelligence

- [ ] Larger election dataset
- [ ] Parliamentary activity
- [ ] Bills
- [ ] Questions
- [ ] Committees
- [ ] Attendance
- [ ] Financial data expansion
- [ ] Company relationships
- [ ] Investigations
- [ ] Legal records
- [ ] News intelligence
- [ ] Relationship graph

## Phase 4 — AI Research

- [ ] Ask CIVIC
- [ ] AI Search
- [ ] Source-grounded answers
- [ ] Document Analyst
- [ ] Research Mode
- [ ] Timeline generation
- [ ] Relationship Explorer
- [ ] News Brief
- [ ] Source Checker

## Phase 5 — Global Expansion

Countries will be added incrementally.

Potential future datasets may include:

- United Kingdom
- United States
- European countries
- Other major democracies
- Additional jurisdictions based on source availability

Each country should be added through the same core data architecture rather than creating a separate application.

---

# Data Quality

CIVIC prioritises correctness over dataset size.

Every ingestion pipeline should support:

- Schema validation
- Required-field validation
- Duplicate detection
- Entity resolution
- Source verification
- Provenance tracking
- Idempotent ingestion
- Historical updates
- Error reporting
- Data-quality checks

The objective is not simply to collect the largest possible amount of data.

The objective is to build a dataset that can be inspected and trusted.

---

# Inspirations

CIVIC is inspired by the ideas and capabilities demonstrated by several open-source and public-interest projects.

### OpenSanctions

Entity resolution, structured data, provenance, and large-scale public-data processing.

### WeThePeople

Political transparency, money flows, influence relationships, government data, and research workflows.

### Project Vigil

Modern political intelligence and visual presentation.

CIVIC is an independent project and is **not affiliated with or a copy of these projects**.

---

# Responsible Use

CIVIC is intended for:

- Journalism
- Academic research
- Public-interest research
- Civic education
- Data analysis
- Transparency research
- Software experimentation
- General public information

Users should independently review source material when making consequential decisions.

CIVIC's AI features are designed to assist research and should not be treated as an independent authority.

---

# Contributing

Contributions are welcome as the project develops.

Potential contribution areas include:

- Data connectors
- Data validation
- Entity resolution
- UI/UX
- Visualisation
- AI/RAG
- Testing
- Documentation
- Country-specific datasets
- Source verification

When contributing data-related functionality, maintain source provenance and licensing information.

---

# License

This project is currently under development.

The final licensing model will be defined before the first public release.

Third-party datasets and sources may have their own licensing and usage restrictions. Contributors must respect the applicable terms of each source.

---

# Status

🚧 **CIVIC is currently under active development.**

The current focus is:

> **India V1 → Verified political data → Provenance → Intelligence layer → AI research → Global expansion**

The architecture is being built for long-term scalability, but the project is intentionally starting with a small verified dataset rather than attempting to ingest the entire world at once.

---

## Vision

CIVIC aims to become a global evidence layer for understanding political power, public money, institutions, elections, and the relationships between them.

```text
Public Sources
      ↓
Structured Data
      ↓
Evidence & Provenance
      ↓
Relationships
      ↓
Intelligence
      ↓
AI-Assisted Research
      ↓
Better Public Understanding
```

**CIVIC — Understand the system. Follow the evidence.**

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
-- Base trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. COUNTRIES
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iso2_code VARCHAR(2) UNIQUE NOT NULL,
    iso3_code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    official_name VARCHAR(255),
    region VARCHAR(100),
    subregion VARCHAR(100),
    currency VARCHAR(50),
    government_type VARCHAR(100),
    population BIGINT,
    flag_url TEXT,
    data_availability_status VARCHAR(50) DEFAULT 'Unavailable',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_countries_modtime BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. SOURCES (Provenance first-class)
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    source_type VARCHAR(100),
    publication_date DATE,
    retrieved_at TIMESTAMPTZ DEFAULT now(),
    country_id UUID REFERENCES countries(id),
    document_type VARCHAR(100),
    author VARCHAR(255),
    license_metadata JSONB DEFAULT '{}'::jsonb,
    verification_status VARCHAR(50) DEFAULT 'Unverified',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_sources_modtime BEFORE UPDATE ON sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type VARCHAR(100),
    file_url TEXT,
    content_text TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_documents_modtime BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. PEOPLE
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    nationality_country_id UUID REFERENCES countries(id),
    biography TEXT,
    photo_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_people_modtime BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. PARTIES
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    official_url TEXT,
    logo_url TEXT,
    founded_date DATE,
    status VARCHAR(50),
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_parties_modtime BEFORE UPDATE ON parties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. POSITIONS
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_positions_modtime BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. POLITICIANS
CREATE TABLE politicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID REFERENCES people(id) NOT NULL,
    country_id UUID REFERENCES countries(id) NOT NULL,
    current_party_id UUID REFERENCES parties(id),
    political_status VARCHAR(100),
    official_profile_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_politicians_modtime BEFORE UPDATE ON politicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. POLITICAL TENURES
CREATE TABLE political_tenures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID REFERENCES politicians(id) NOT NULL,
    position_id UUID REFERENCES positions(id) NOT NULL,
    party_id UUID REFERENCES parties(id),
    start_date DATE,
    end_date DATE,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_political_tenures_modtime BEFORE UPDATE ON political_tenures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. COMPANIES & ORGANISATIONS
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    registration_number VARCHAR(100),
    country_id UUID REFERENCES countries(id),
    website TEXT,
    industry VARCHAR(100),
    status VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    org_type VARCHAR(100),
    country_id UUID REFERENCES countries(id),
    website TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_organisations_modtime BEFORE UPDATE ON organisations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. FINANCIAL DATA
CREATE TABLE financial_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID REFERENCES politicians(id) NOT NULL,
    source_id UUID REFERENCES sources(id) NOT NULL,
    declaration_date DATE NOT NULL,
    currency VARCHAR(10),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_financial_declarations_modtime BEFORE UPDATE ON financial_declarations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    declaration_id UUID REFERENCES financial_declarations(id) ON DELETE CASCADE,
    asset_type VARCHAR(100),
    description TEXT,
    declared_value NUMERIC,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE liabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    declaration_id UUID REFERENCES financial_declarations(id) ON DELETE CASCADE,
    liability_type VARCHAR(100),
    description TEXT,
    declared_value NUMERIC,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE income_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    declaration_id UUID REFERENCES financial_declarations(id) ON DELETE CASCADE,
    income_source VARCHAR(255),
    declared_value NUMERIC,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE business_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID REFERENCES people(id) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    interest_type VARCHAR(100),
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_entity_type VARCHAR(50),
    donor_entity_id UUID,
    recipient_entity_type VARCHAR(50),
    recipient_entity_id UUID,
    amount NUMERIC,
    currency VARCHAR(10),
    donation_date DATE,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. RELATIONSHIPS GRAPH
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_type VARCHAR(50) NOT NULL,
    source_entity_id UUID NOT NULL,
    target_entity_type VARCHAR(50) NOT NULL,
    target_entity_id UUID NOT NULL,
    relationship_type VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    source_id UUID REFERENCES sources(id),
    confidence VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_relationships_source ON relationships(source_entity_type, source_entity_id);
CREATE INDEX idx_relationships_target ON relationships(target_entity_type, target_entity_id);

-- 12. NEWS
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    country_id UUID REFERENCES countries(id),
    civic_summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_news_articles_modtime BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE news_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
    topic VARCHAR(100) NOT NULL
);

CREATE TABLE news_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    mention_context TEXT
);

-- 13. LEGAL / INVESTIGATIONS
CREATE TABLE investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    country_id UUID REFERENCES countries(id),
    status VARCHAR(100),
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_investigations_modtime BEFORE UPDATE ON investigations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE court_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(100),
    court_name VARCHAR(255),
    country_id UUID REFERENCES countries(id),
    status VARCHAR(100),
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_court_cases_modtime BEFORE UPDATE ON court_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE legal_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id UUID REFERENCES investigations(id),
    court_case_id UUID REFERENCES court_cases(id),
    event_type VARCHAR(100) NOT NULL,
    event_date DATE,
    description TEXT,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE allegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    description TEXT,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_case_id UUID REFERENCES court_cases(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    charge_description TEXT NOT NULL,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE convictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    charge_id UUID REFERENCES charges(id),
    sentence TEXT,
    conviction_date DATE,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE court_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_case_id UUID REFERENCES court_cases(id),
    outcome_type VARCHAR(100),
    description TEXT,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. POLITICS & ELECTIONS
CREATE TABLE elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    election_type VARCHAR(100),
    election_date DATE,
    name VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_elections_modtime BEFORE UPDATE ON elections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE constituencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES elections(id) NOT NULL,
    constituency_id UUID REFERENCES constituencies(id) NOT NULL,
    person_id UUID REFERENCES people(id) NOT NULL,
    party_id UUID REFERENCES parties(id),
    is_winner BOOLEAN DEFAULT false,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE election_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) NOT NULL,
    votes_received BIGINT,
    vote_share NUMERIC,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. PARLIAMENTARY ACTIVITY
CREATE TABLE parliamentary_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    session_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES parliamentary_activity(id),
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(100),
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID REFERENCES bills(id),
    politician_id UUID REFERENCES politicians(id) NOT NULL,
    vote_decision VARCHAR(50),
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE speeches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES parliamentary_activity(id),
    politician_id UUID REFERENCES politicians(id) NOT NULL,
    transcript TEXT,
    speech_date DATE,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES parliamentary_activity(id),
    politician_id UUID REFERENCES politicians(id) NOT NULL,
    question_text TEXT,
    answer_text TEXT,
    question_date DATE,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES parliamentary_activity(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES parliamentary_activity(id),
    politician_id UUID REFERENCES politicians(id) NOT NULL,
    days_present INT,
    days_total INT,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 16. POWER METRICS
CREATE TABLE military_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    year INT NOT NULL,
    military_expenditure NUMERIC,
    armed_forces_personnel BIGINT,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE defence_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    year INT NOT NULL,
    description TEXT,
    value NUMERIC,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE arms_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_country_id UUID REFERENCES countries(id),
    recipient_country_id UUID REFERENCES countries(id),
    year INT NOT NULL,
    transfer_value NUMERIC,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE nuclear_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    year INT NOT NULL,
    estimated_inventory INT,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE strategic_capabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    capability_name VARCHAR(255),
    description TEXT,
    source_id UUID REFERENCES sources(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE economic_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) NOT NULL,
    year INT NOT NULL,
    gdp NUMERIC,
    gdp_per_capita NUMERIC,
    government_expenditure NUMERIC,
    source_id UUID REFERENCES sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 17. AI & RAG ARCHITECTURE
CREATE TABLE ai_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id),
    content TEXT NOT NULL,
    document_hash VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ai_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_document_id UUID REFERENCES ai_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ai_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_chunk_id UUID REFERENCES ai_chunks(id) ON DELETE CASCADE,
    embedding extensions.vector(768), 
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ai_embeddings_vector ON ai_embeddings USING hnsw (embedding extensions.vector_cosine_ops);

CREATE TABLE ai_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sources_used JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 18. IDEMPOTENCY CONSTRAINTS
CREATE UNIQUE INDEX idx_sources_url ON sources(url) WHERE url IS NOT NULL;
ALTER TABLE companies ADD CONSTRAINT companies_country_reg_uq UNIQUE (country_id, registration_number);
ALTER TABLE candidates ADD CONSTRAINT candidates_election_person_const_uq UNIQUE (election_id, person_id, constituency_id);
ALTER TABLE election_results ADD CONSTRAINT election_results_candidate_uq UNIQUE (candidate_id);
CREATE UNIQUE INDEX idx_news_articles_source ON news_articles(source_id) WHERE source_id IS NOT NULL;
ALTER TABLE ai_documents ADD CONSTRAINT ai_documents_hash_uq UNIQUE (document_hash);
ALTER TABLE ai_chunks ADD CONSTRAINT ai_chunks_doc_index_uq UNIQUE (ai_document_id, chunk_index);

-- Indexes
CREATE INDEX idx_people_name ON people(full_name);
CREATE INDEX idx_politicians_person ON politicians(person_id);
CREATE INDEX idx_politicians_country ON politicians(country_id);
CREATE INDEX idx_sources_country ON sources(country_id);
CREATE INDEX idx_news_articles_country ON news_articles(country_id);


-- Enable RLS for all tables (Deny all by default for public, explicitly allow read on public tables)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE politicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE political_tenures ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE allegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE convictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentary_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE speeches ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE military_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE defence_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE arms_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE economic_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_answers ENABLE ROW LEVEL SECURITY;

-- Explicitly allow public read access to verified public records
CREATE POLICY "Allow public read access on countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Allow public read access on people" ON people FOR SELECT USING (true);
CREATE POLICY "Allow public read access on politicians" ON politicians FOR SELECT USING (true);
CREATE POLICY "Allow public read access on parties" ON parties FOR SELECT USING (true);
CREATE POLICY "Allow public read access on positions" ON positions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on political_tenures" ON political_tenures FOR SELECT USING (true);
CREATE POLICY "Allow public read access on companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on organisations" ON organisations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on news_articles" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on investigations" ON investigations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on elections" ON elections FOR SELECT USING (true);
CREATE POLICY "Allow public read access on candidates" ON candidates FOR SELECT USING (true);


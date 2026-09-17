import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { CivicSource } from '@/components/ui/civic-source';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'fake-key'
);

export default async function PoliticianPage({ params }: { params: { id: string } }) {
  // Wait for params in Next.js 15
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: politician } = await supabase
    .from('politicians')
    .select('*, people(full_name, date_of_birth), parties(name)')
    .eq('id', id)
    .single();

  if (!politician) {
    return <main className="p-8"><p className="text-slate-400">Politician not found.</p></main>;
  }

  const { data: financials } = await supabase
    .from('financial_declarations')
    .select('*, sources(url, publisher, source_type, retrieved_at, verification_status, metadata), assets(*), liabilities(*)')
    .eq('politician_id', politician.id)
    .order('declaration_date', { ascending: false });

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{politician.people?.full_name}</h1>
      <p className="text-xl text-slate-400 mb-8">{politician.parties?.name}</p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">Financial Declarations</h2>
        {financials && financials.length > 0 ? (
          <div className="space-y-8">
            {financials.map((decl: any) => {
              const totalAssets = decl.assets?.reduce((sum: number, a: any) => sum + Number(a.declared_value || 0), 0) || 0;
              const totalLiabilities = decl.liabilities?.reduce((sum: number, l: any) => sum + Number(l.declared_value || 0), 0) || 0;
              const netDeclaredPosition = totalAssets - totalLiabilities;
              const source = decl.sources;

              return (
                <div key={decl.id} className="p-6 bg-slate-800 rounded-lg border border-slate-700">
                  <h3 className="text-lg font-medium mb-4">Declaration Date: {new Date(decl.declaration_date).toLocaleDateString()}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-slate-900 rounded">
                      <span className="block text-slate-500 text-xs mb-1">DECLARED ASSETS</span>
                      <span className="text-xl font-mono text-green-400">{decl.currency} {totalAssets.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-slate-900 rounded">
                      <span className="block text-slate-500 text-xs mb-1">DECLARED LIABILITIES</span>
                      <span className="text-xl font-mono text-red-400">{decl.currency} {totalLiabilities.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-blue-900/50 rounded shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                      <span className="block text-slate-500 text-xs mb-1">CIVIC CALCULATED NET DECLARED POSITION</span>
                      <span className="text-xl font-mono text-blue-400">{decl.currency} {netDeclaredPosition.toLocaleString()}</span>
                    </div>
                  </div>

                  {source && (
                    <CivicSource 
                      sourceName={source.publisher} 
                      sourceType={source.source_type} 
                      retrievedAt={source.retrieved_at} 
                      url={source.url}
                      verificationStatus={source.verification_status}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 italic">No financial declarations available.</p>
        )}
      </section>
    </main>
  );
}

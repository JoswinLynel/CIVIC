import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase admin client (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SECRET_KEY || 'fake-key'
);

interface Party {
  id: string;
  name: string;
  short_name?: string;
}

interface Politician {
  id: string;
  people?: { full_name: string } | { full_name: string }[];
  parties?: { name: string } | { name: string }[];
}

export default async function IndiaPage() {
  const { data: country } = await supabase.from('countries').select().eq('iso3_code', 'IND').single();
  const { data: parties } = await supabase.from('parties').select().eq('country_id', country?.id);
  const { data: politicians } = await supabase.from('politicians').select('id, people(full_name), parties(name)').eq('country_id', country?.id);

  if (!country) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">India</h1>
        <p className="text-slate-400">Data Availability: Unavailable</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{country.official_name || country.name}</h1>
      <p className="text-slate-400 mb-8">Data Availability: {country.data_availability_status}</p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">Political Parties</h2>
        {parties && parties.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {parties.map((party: Party) => (
              <li key={party.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <span className="block font-medium">{party.name}</span>
                {party.short_name && <span className="text-sm text-slate-400">{party.short_name}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 italic">No parties available.</p>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">Politicians</h2>
        {politicians && politicians.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {politicians.map((pol: Politician) => (
              <li key={pol.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <a href={`/politicians/${pol.id}`} className="block font-medium text-blue-400 hover:underline">
                  {Array.isArray(pol.people) ? pol.people[0]?.full_name : pol.people?.full_name}
                </a>
                <span className="text-sm text-slate-400">{Array.isArray(pol.parties) ? pol.parties[0]?.name : pol.parties?.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 italic">No politicians available.</p>
        )}
      </section>
    </main>
  );
}

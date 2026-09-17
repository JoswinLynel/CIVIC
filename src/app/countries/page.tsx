import React from 'react';
import { CivicEmptyState } from '@/components/ui/civic-empty-state';

export default function CountriesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-civic-ivory">Countries</h1>
        <p className="text-civic-grey">
          Explore and analyze global countries data and intelligence.
        </p>
      </div>
      
      <CivicEmptyState 
        title="No data available yet" 
        description="This section is currently being provisioned. Data connectors for countries intelligence are scheduled for the next release phase."
      />
    </div>
  );
}

import React from 'react';
import { CivicEmptyState } from '@/components/ui/civic-empty-state';

export default function MoneyPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-civic-ivory">Money</h1>
        <p className="text-civic-grey">
          Explore and analyze global money data and intelligence.
        </p>
      </div>
      
      <CivicEmptyState 
        title="No data available yet" 
        description="This section is currently being provisioned. Data connectors for money intelligence are scheduled for the next release phase."
      />
    </div>
  );
}

import { CivicCard, CivicCardContent, CivicCardHeader, CivicCardTitle } from "@/components/ui/civic-card";
import { CivicMetric } from "@/components/ui/civic-metric";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Global Overview</h1>
        <p className="text-civic-grey text-lg max-w-3xl">
          CIVIC is a global political, financial, public-record, geopolitical, and news intelligence platform.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CivicCard>
          <CivicCardHeader>
            <CivicCardTitle>Active Countries</CivicCardTitle>
          </CivicCardHeader>
          <CivicCardContent>
             <CivicMetric label="Tracked" value="3" trend="neutral" trendValue="Seed Data" />
          </CivicCardContent>
        </CivicCard>
        
        <CivicCard>
          <CivicCardHeader>
            <CivicCardTitle>Politicians</CivicCardTitle>
          </CivicCardHeader>
          <CivicCardContent>
             <CivicMetric label="Total Profiles" value="0" />
          </CivicCardContent>
        </CivicCard>

        <CivicCard>
          <CivicCardHeader>
            <CivicCardTitle>Financial Records</CivicCardTitle>
          </CivicCardHeader>
          <CivicCardContent>
             <CivicMetric label="Declarations" value="0" />
          </CivicCardContent>
        </CivicCard>

        <CivicCard>
          <CivicCardHeader>
            <CivicCardTitle>News Intelligence</CivicCardTitle>
          </CivicCardHeader>
          <CivicCardContent>
             <CivicMetric label="Articles" value="0" />
          </CivicCardContent>
        </CivicCard>
      </section>

      <section>
         <CivicCard className="border-civic-gold/20">
          <CivicCardHeader>
            <CivicCardTitle className="text-civic-gold">Intelligence Brief</CivicCardTitle>
          </CivicCardHeader>
          <CivicCardContent>
            <div className="py-12 text-center">
               <p className="text-civic-grey">No verified records have been imported yet. Connect a supported source to begin populating this section.</p>
            </div>
          </CivicCardContent>
        </CivicCard>
      </section>

    </div>
  );
}

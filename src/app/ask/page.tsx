export default function AskCivicPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Ask CIVIC</h1>
        <p className="text-civic-grey text-lg">
          AI-powered research assistant grounded in public-record data.
        </p>
      </section>

      <div className="border border-civic-elevated bg-civic-surface/50 rounded-lg h-[600px] flex flex-col">
        <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-civic-grey text-center max-w-md">
                CIVIC AI is currently in Phase 1 initialization. <br/><br/>
                Once data ingestion pipelines are active, you can ask questions like <em>&quot;What are this politician&apos;s declared assets?&quot;</em> or <em>&quot;Show their political timeline.&quot;</em>
            </p>
        </div>
        <div className="p-4 border-t border-civic-elevated bg-civic-surface">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Ask a question about a politician, company, or event..." 
                    className="w-full bg-civic-surface-secondary border border-civic-elevated rounded-md py-3 px-4 text-civic-ivory placeholder:text-civic-grey focus:outline-none focus:border-civic-gold/50"
                    disabled
                />
            </div>
        </div>
      </div>
    </div>
  );
}

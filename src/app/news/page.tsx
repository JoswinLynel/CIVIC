export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <section className="space-y-4 border-b border-civic-elevated/50 pb-8">
        <h1 className="text-4xl font-bold tracking-tight">News Intelligence</h1>
        <div className="flex space-x-4">
          <span className="text-sm px-3 py-1 bg-civic-elevated text-civic-ivory rounded-full">Latest</span>
          <span className="text-sm px-3 py-1 bg-civic-surface-secondary text-civic-grey rounded-full cursor-pointer hover:bg-civic-elevated">Trending</span>
          <span className="text-sm px-3 py-1 bg-civic-surface-secondary text-civic-grey rounded-full cursor-pointer hover:bg-civic-elevated">Politics</span>
          <span className="text-sm px-3 py-1 bg-civic-surface-secondary text-civic-grey rounded-full cursor-pointer hover:bg-civic-elevated">Investigations</span>
        </div>
      </section>

      <section>
        <div className="py-24 flex flex-col items-center justify-center border border-civic-elevated border-dashed rounded-lg bg-civic-surface/50">
            <h3 className="text-xl font-semibold text-civic-ivory mb-2">No Verified Records</h3>
            <p className="text-civic-grey max-w-md text-center">
              Connect a supported news source to begin processing articles through the intelligence pipeline.
            </p>
        </div>
      </section>
    </div>
  );
}

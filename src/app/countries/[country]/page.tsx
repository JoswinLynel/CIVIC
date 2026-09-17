export default function CountryPage({ params }: { params: { country: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <header className="space-y-4">
        <div className="text-xs text-civic-gold tracking-widest uppercase font-semibold">Country Overview</div>
        <h1 className="text-5xl font-bold capitalize">{params.country}</h1>
        <div className="flex space-x-6 text-sm text-civic-grey">
            <span>Population: --</span>
            <span>GDP: --</span>
            <span>Government: --</span>
        </div>
      </header>

      <div className="border-b border-civic-elevated">
          <nav className="flex space-x-8 text-sm">
            <span className="py-4 border-b-2 border-civic-gold text-civic-ivory font-medium">Overview</span>
            <span className="py-4 text-civic-grey">Politics</span>
            <span className="py-4 text-civic-grey">Economy</span>
            <span className="py-4 text-civic-grey">Military</span>
            <span className="py-4 text-civic-grey">News</span>
          </nav>
      </div>

      <section>
        <div className="py-24 flex flex-col items-center justify-center border border-civic-elevated border-dashed rounded-lg bg-civic-surface/50">
            <h3 className="text-xl font-semibold text-civic-ivory mb-2">Data Unavailable</h3>
            <p className="text-civic-grey max-w-md text-center">
              No verified records have been imported yet. Connect a supported source to begin populating this section.
            </p>
        </div>
      </section>
    </div>
  );
}

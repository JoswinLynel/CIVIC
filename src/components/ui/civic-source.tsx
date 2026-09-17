import React from 'react';

export interface CivicSourceProps {
  sourceName: string;
  sourceType: string;
  retrievedAt: string;
  url?: string;
  verificationStatus: string;
}

export function CivicSource({ sourceName, sourceType, retrievedAt, url, verificationStatus }: CivicSourceProps) {
  const isSynthetic = verificationStatus === 'synthetic_test_data';

  return (
    <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50 mt-4 text-sm text-slate-300">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-100 uppercase text-xs tracking-wider">Source</h4>
        {isSynthetic && (
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-xs border border-yellow-500/30 font-medium">
            SYNTHETIC TEST DATA
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="block text-slate-500 text-xs mb-1">PUBLISHER</span>
          <span className="font-medium text-slate-200">{sourceName}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs mb-1">TYPE</span>
          <span>{sourceType}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs mb-1">RETRIEVED</span>
          <span>{new Date(retrievedAt).toLocaleDateString()}</span>
        </div>
        {url && (
          <div>
            <span className="block text-slate-500 text-xs mb-1">ORIGINAL LINK</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
              View Source ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useContext, useState } from 'react';
import { DataContext } from '../App';
import InsightCard from '../components/InsightCard';
import { TrendLineChart } from '../components/TrendChart';
import ErrorBoundary from '../components/ErrorBoundary';

const Analytics = () => {
  const { payload, activeSignals, loading, sessionHistory } = useContext(DataContext);
  const [selectedZone, setSelectedZone] = useState(null);

  if (loading || !payload) return <div className="p-4 flex h-full items-center justify-center text-text-muted">Loading command center...</div>;

  const zones = Array.isArray(payload.zones) ? payload.zones : [];
  const safeSignals = Array.isArray(activeSignals) ? activeSignals : [];

  // Default to first zone if selectedZone not set yet
  const zoneData = zones.find(z => z.id === selectedZone) || zones[0];
  if (!zoneData) return <div className="p-4 text-text-muted">No zone data available.</div>;

  const chartLines = safeSignals.slice(0, 3).map((sig, i) => ({
    key: sig.id,
    name: sig.label,
    color: ['#f59e0b', '#3b82f6', '#ef4444', '#10b981'][i % 4]
  }));

  const normalizedData = (sessionHistory || []).map(h => {
    const obj = { t: h.t };
    const zoneH = h[zoneData.id] || {};
    safeSignals.slice(0, 3).forEach(sig => {
      const raw = zoneH[sig.id] || 0;
      obj[sig.id] = sig.id === 'incidents' ? raw * 10 : raw; // scale incidents for better overlay visibility
    });
    return obj;
  });

  let insightText = "No anomaly detected in the current reading.";
  if (zoneData.overall?.summary && zoneData.overall?.summary !== "No data available") {
    insightText = zoneData.overall.summary;
  } else if (zoneData.evidence && zoneData.evidence.length > 0) {
    insightText = zoneData.evidence.join(' ');
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold font-display">Analytics & Correlations</h1>
        <select 
          className="bg-[var(--navy-panel)] border border-[var(--navy-border)] text-text-primary px-3 py-1.5 rounded-md text-sm outline-none"
          value={selectedZone || zoneData.id}
          onChange={e => setSelectedZone(e.target.value)}
        >
          {zones.map(z => <option key={z.id} value={z.id}>{z.name || 'Unknown'}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-4 text-sm bg-[var(--navy-bg)] border border-[var(--navy-border)] p-3 rounded-lg shrink-0">
        <span className="text-text-secondary font-bold">Source Status:</span>
        {safeSignals.slice(0,3).map(sig => {
          const s = zoneData.signals?.[sig.id]?.source || 'fixture';
          return (
             <div key={sig.id} className="flex items-center gap-2">
               <span className="capitalize text-text-muted">{sig.label}:</span>
               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s === 'live' ? 'bg-blue-900/40 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>{s}</span>
             </div>
          );
        })}
      </div>

      <InsightCard summary={insightText} intelligence={zoneData.overall?.intelligence} />

      <ErrorBoundary>
        <div className="glass-panel p-4 rounded-xl flex flex-col min-h-[400px]">
          <h3 className="text-sm font-bold text-text-secondary mb-4 flex items-center justify-between">
            <span>Multi-Signal Overlay - {zoneData.name || 'Unknown'}</span>
            <span className="text-xs text-text-muted font-normal">Session history — since dashboard opened</span>
          </h3>
          {(sessionHistory || []).length > 1 ? (
            <TrendLineChart data={normalizedData} lines={chartLines} height={400} />
          ) : (
            <div className="flex items-center justify-center flex-1 text-text-muted">Collecting session readings...</div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Analytics;

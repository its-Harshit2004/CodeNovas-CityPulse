import React, { useContext, useState } from 'react';
import { DataContext } from '../App';
import InsightCard from '../components/InsightCard';
import { TrendLineChart } from '../components/TrendChart';
import ErrorBoundary from '../components/ErrorBoundary';

const Analytics = () => {
  const { payload, activeSignals, loading } = useContext(DataContext);
  const [selectedZone, setSelectedZone] = useState(null);

  if (loading || !payload) return <div className="p-4 text-text-muted">Loading...</div>;

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

  const history = Array.isArray(zoneData.history) ? zoneData.history : [];
  const normalizedData = history.map(h => {
    const obj = { t: h.t };
    safeSignals.slice(0, 3).forEach(sig => {
      const raw = h[sig.id] || 0;
      obj[sig.id] = sig.id === 'incidents' || sig.id === 'waterlogging' ? raw * 10 : raw;
    });
    return obj;
  });

  const insightText = `Correlation analysis dynamically tracks active signals in ${zoneData.name || 'Unknown'}.`;

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

      <InsightCard summary={insightText} />

      <ErrorBoundary>
        <div className="glass-panel p-4 rounded-xl flex flex-col min-h-[400px]">
          <h3 className="text-sm font-bold text-text-secondary mb-4">Multi-Signal Overlay - {zoneData.name || 'Unknown'}</h3>
          <TrendLineChart data={normalizedData} lines={chartLines} height={400} />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Analytics;

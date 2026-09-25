import React, { useContext, useState } from 'react';
import { DataContext } from '../App';
import KpiCard from '../components/KpiCard';
import CityMap from '../components/map/CityMap';
import ZoneDetailsPanel from '../components/ZoneDetailsPanel';
import SuddenChanges from '../components/SuddenChanges';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard = () => {
  const { payload, activeSignals, loading } = useContext(DataContext);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  if (loading || !payload) return <div className="p-4 flex h-full items-center justify-center text-text-muted">Loading command center...</div>;

  const zones = Array.isArray(payload.zones) ? payload.zones : [];
  const events = Array.isArray(payload.events) ? payload.events : [];
  const suddenChanges = Array.isArray(payload.suddenChanges) ? payload.suddenChanges : [];
  const timeline = Array.isArray(payload.timeline) ? payload.timeline : [];
  const safeSignals = Array.isArray(activeSignals) ? activeSignals : [];

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  // Derive city overall
  const activeAlerts = events.filter(e => e.status !== 'green').length;
  
  // Basic overall stats
  let maxRisk = null;
  let worseStatus = 'green';
  zones.forEach(z => {
    if (z.overall?.riskScore !== undefined && z.overall?.riskScore !== null) {
      if (maxRisk === null || z.overall.riskScore > maxRisk) maxRisk = z.overall.riskScore;
    }
    if (z.overall?.status === 'red') worseStatus = 'red';
    else if (z.overall?.status === 'amber' && worseStatus !== 'red') worseStatus = 'amber';
  });

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full">
      {/* LEFT COLUMN: Map & KPIs */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* Banner */}
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">City Status</h2>
            <StatusBadge status={worseStatus} className="px-3 py-1 text-sm" />
          </div>
          <div className="flex gap-6 text-sm">
            <div>Risk Score: <span className="font-mono font-bold text-lg">{maxRisk !== null ? maxRisk : '—'}</span><span className="text-text-muted">/100 max</span></div>
            <div>Active Events: <span className="font-mono font-bold text-lg text-amber-400">{activeAlerts}</span></div>
          </div>
        </div>

        {/* Dynamic KPIs (Top 3 signals + Events) */}
        <ErrorBoundary>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            {safeSignals.slice(0, 3).map(sig => {
              let total = 0, count = 0;
              zones.forEach(z => {
                const sigData = z.signals?.[sig.id];
                if (sigData !== undefined && sigData !== null) {
                  total += sigData.value ?? 0;
                  count++;
                }
              });
              const avg = count ? Math.round(total / count) : 0;
              return <KpiCard key={sig.id} title={`Avg ${sig.label}`} value={sig.format ? sig.format(avg) : avg} trend="flat" icon={sig.icon} />;
            })}
            <KpiCard title="Active Events" value={activeAlerts} unit="total" trend={activeAlerts > 0 ? 'up' : 'flat'} icon="alert-triangle" highlight={activeAlerts > 0} />
          </div>
        </ErrorBoundary>

        {/* Map Hero */}
        <div className="flex-1 flex flex-col min-h-[400px]">
          <CityMap 
            zones={zones} 
            events={events}
            mode="overall"
            activeSignals={safeSignals}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
          />
        </div>

      </div>

      {/* RIGHT RAIL */}
      <div className="w-full xl:w-96 shrink-0 flex flex-col gap-6 relative h-[800px] xl:h-auto min-h-0">
        
        {selectedZone && (
          <ZoneDetailsPanel zone={selectedZone} activeSignals={safeSignals} onClose={() => setSelectedZoneId(null)} />
        )}

        {/* Sudden Changes */}
        <SuddenChanges changes={suddenChanges} activeSignals={safeSignals} onSelectZone={setSelectedZoneId} />

        {/* Zone Strip Summaries */}
        <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 shrink-0">
          <h3 className="text-sm font-bold text-text-secondary">Zone Quick Status</h3>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {zones.map(z => (
              <button key={z.id} onClick={() => setSelectedZoneId(z.id)} className="flex items-center justify-between p-2 rounded-lg bg-[var(--navy-bg)] border border-[var(--navy-border)] hover:border-text-muted transition-colors text-left">
                <div className="flex items-center gap-3">
                  <StatusBadge status={z.overall?.status} />
                  <span className="text-sm font-semibold">{z.name || 'Unknown'}</span>
                </div>
                <span className="text-xs text-text-muted font-mono">{z.overall?.riskScore !== undefined && z.overall?.riskScore !== null ? `${z.overall.riskScore}/100` : '—'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Timeline */}
        <div className="glass-panel p-4 rounded-xl flex-1 flex flex-col min-h-[200px]">
          <h3 className="text-sm font-bold text-text-secondary mb-4 flex items-center gap-2">
            Live Timeline <span className="relative flex h-2 w-2 ml-auto"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
          </h3>
          <div className="flex-1 overflow-y-auto pr-2">
            <Timeline events={timeline} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default function DashboardBoundary() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

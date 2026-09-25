import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from '../App';
import CityMap from '../components/map/CityMap';
import InsightCard from '../components/InsightCard';
import StatusBadge from '../components/StatusBadge';
import { TrendLineChart, TrendBarChart } from '../components/TrendChart';
import { getSignalDef } from '../config/signalRegistry';
import ErrorBoundary from '../components/ErrorBoundary';
import { DynamicIcon } from '../utils/iconResolver';

const SignalPage = () => {
  const { signalId } = useParams();
  const { payload, loading, activeSignals } = useContext(DataContext);
  const [selectedZone, setSelectedZone] = useState(null);

  if (loading || !payload) return <div className="p-4 text-text-muted">Loading...</div>;

  const safeSignals = activeSignals || [];
  const def = safeSignals.find(s => s.id === signalId) || getSignalDef(signalId);
  const zones = Array.isArray(payload.zones) ? payload.zones : [];

  const getHistoryDataForChart = () => {
    const h = Array.isArray(zones[0]?.history) ? zones[0].history : [];
    return h.map((point, i) => {
      const obj = { t: point.t };
      zones.forEach(z => {
        const zoneHistory = Array.isArray(z.history) ? z.history : [];
        obj[z.name || 'Unknown'] = zoneHistory[i]?.[signalId] || 0;
      });
      return obj;
    });
  };

  const barData = zones.map(z => ({
    name: z.name || 'Unknown',
    current: z.signals?.[signalId]?.value || 0,
    baseline: z.signals?.[signalId]?.baseline || 0
  }));

  const chartLines = zones.map((z, i) => ({
    key: z.name || 'Unknown',
    name: z.name || 'Unknown',
    color: ['#3b82f6', '#f59e0b', '#a855f7', '#10b981'][i % 4]
  }));

  const sortedZones = [...zones].sort((a,b) => {
    const da = a.signals?.[signalId]?.deltaPct || 0;
    const db = b.signals?.[signalId]?.deltaPct || 0;
    return def.higherIsWorse ? db - da : da - db;
  });
  
  const worstZone = sortedZones[0];
  const insightText = worstZone ? `${def.label} analysis indicates ${worstZone.name || 'Unknown Zone'} is showing the most significant deviation (${worstZone.signals?.[signalId]?.deltaPct || 0}%) from historical baselines.` : `No significant ${def.label} deviations detected.`;

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <DynamicIcon name={def.icon} className="text-blue-400" /> {def.label} Analysis
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto pb-6">
        <div className="col-span-1 xl:col-span-2 flex flex-col gap-6">
          <ErrorBoundary>
            <div className="glass-panel p-4 rounded-xl flex-1 flex flex-col min-h-[300px]">
              <h3 className="text-sm font-bold text-text-secondary mb-4">Current {def.label} vs Baseline ({def.unit})</h3>
              <TrendBarChart data={barData} bars={[{key: 'current', name: 'Current', color: '#3b82f6'}, {key: 'baseline', name: 'Baseline', color: '#334155'}]} height={250} />
            </div>
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="glass-panel p-4 rounded-xl flex-1 flex flex-col min-h-[300px]">
              <h3 className="text-sm font-bold text-text-secondary mb-4">{def.label} History</h3>
              <TrendLineChart data={getHistoryDataForChart()} lines={chartLines} height={250} />
            </div>
          </ErrorBoundary>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel p-4 rounded-xl flex flex-col h-[350px]">
             <h3 className="text-sm font-bold text-text-secondary mb-2">Live {def.label} Map</h3>
             <CityMap 
               zones={zones} 
               mode={signalId} 
               activeSignals={safeSignals}
               selectedZoneId={selectedZone}
               onSelectZone={setSelectedZone}
               allowFullscreen={true}
             />
          </div>

          <InsightCard summary={insightText} />

          <ErrorBoundary>
            <div className="glass-panel p-4 rounded-xl flex-1 overflow-x-auto">
               <h3 className="text-sm font-bold text-text-secondary mb-4">Zone Breakdown</h3>
               <table className="w-full text-left text-sm min-w-[200px]">
                 <thead>
                   <tr className="text-text-muted border-b border-[var(--navy-border)]">
                     <th className="pb-2 font-medium">Zone</th>
                     <th className="pb-2 font-medium">Value</th>
                     <th className="pb-2 font-medium">Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {sortedZones.map(z => {
                     const sig = z.signals?.[signalId];
                     if (!sig) return null;
                     return (
                       <tr key={z.id || Math.random()} className="border-b border-[var(--navy-border)]/50 last:border-0 hover:bg-[var(--navy-panel-hover)] transition-colors cursor-pointer" onClick={() => setSelectedZone(z.id)}>
                         <td className="py-3 font-medium">{z.name || 'Unknown'}</td>
                         <td className="py-3 font-mono">{def.format(sig.value ?? 0)}</td>
                         <td className="py-3"><StatusBadge status={sig.status} /></td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default function SignalPageBoundary() {
  const { signalId } = useParams();
  return (
    <ErrorBoundary resetKeys={[signalId]}>
      <SignalPage />
    </ErrorBoundary>
  );
}

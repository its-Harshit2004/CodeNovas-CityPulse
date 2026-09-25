import React from 'react';
import { X, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import InsightCard from './InsightCard';
import dayjs from 'dayjs';
import { DynamicIcon } from '../utils/iconResolver';
import ErrorBoundary from './ErrorBoundary';

const ZoneDetailsPanelContent = ({ zone, activeSignals, onClose }) => {
  if (!zone) return null;
  const safeSignals = activeSignals || [];

  return (
    <div className="glass-panel rounded-xl flex flex-col h-full overflow-hidden absolute inset-0 z-10 animate-in slide-in-from-right-4 duration-200">
      <div className="flex justify-between items-center p-4 border-b border-[var(--navy-border)] shrink-0 bg-[var(--navy-bg)]/80">
        <div>
          <h2 className="text-lg font-bold">{zone.name || 'Unknown Zone'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={zone.overall?.status} />
            <span className="text-xs text-text-muted">Risk Score: {zone.overall?.riskScore ?? 0}/100</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[var(--navy-panel-hover)] rounded-md transition-colors"><X size={18}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <InsightCard 
          summary={zone.overall?.summary} 
          confidence={zone.overall?.confidence} 
          generatedAt={zone.overall?.generatedAt} 
        />

        {Array.isArray(zone.overall?.drivers) && zone.overall.drivers.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Primary Drivers</h3>
            <div className="flex flex-col gap-1">
              {zone.overall.drivers.map((d, i) => {
                const sDef = safeSignals.find(s => s.id === d.signalId);
                return (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-[var(--navy-border)]/50 pb-1">
                    <span>{sDef ? sDef.label : d.signalId}</span>
                    <span className="font-mono text-amber-400">{((d.weight || 0) * 100).toFixed(0)}% contribution</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Live Signals</h3>
          {Object.keys(zone.signals || {}).map(sigKey => {
            const sig = zone.signals[sigKey];
            const def = safeSignals.find(s => s.id === sigKey);
            if (!def) return null;
            
            return (
              <div key={sigKey} className="bg-[var(--navy-bg)] border border-[var(--navy-border)] p-3 rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium text-sm flex items-center gap-2">
                    <DynamicIcon name={def.icon} size={14} className="text-text-secondary"/> {def.label}
                  </span>
                  <StatusBadge status={sig.status} />
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold">{sig.value ?? '—'}</span>
                    <span className="text-xs text-text-muted">{def.unit}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-secondary">Base: {sig.baseline ?? '—'}</div>
                    <div className={`text-xs font-medium ${sig.deltaPct > 0 ? (def.higherIsWorse ? 'text-amber-400' : 'text-green-400') : (def.higherIsWorse ? 'text-green-400' : 'text-amber-400')}`}>
                      {sig.deltaPct > 0 ? '+' : ''}{sig.deltaPct || 0}%
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-text-muted flex items-center gap-1 mt-1 border-t border-[var(--navy-border)] pt-2">
                  <Clock size={10} /> updated {sig.updatedAt ? dayjs(sig.updatedAt).format('HH:mm:ss') : '—'}
                </div>
              </div>
            );
          })}
        </div>

        {Array.isArray(zone.predictions) && zone.predictions.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Predicted Problems</h3>
            <div className="flex flex-col gap-2">
              {zone.predictions.map((p, i) => (
                <div key={p.id || i} className="bg-amber-950/30 border border-amber-500/30 p-2 rounded text-sm text-amber-200/90">
                  <div className="font-bold flex items-center justify-between mb-1">
                    <span>+{Math.round((p.horizonMinutes || 0)/60)}h Horizon</span>
                    <StatusBadge status={p.predictedStatus} />
                  </div>
                  <div>{p.headline}</div>
                  <div className="text-[10px] mt-1 opacity-70">Impact: {p.possibleImpact}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-text-muted mt-1 italic">* Predicted, not confirmed.</div>
          </div>
        )}

        {Array.isArray(zone.evidence) && zone.evidence.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Evidence Log</h3>
            <ul className="text-sm text-text-primary flex flex-col gap-2">
              {zone.evidence.map((ev, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-text-muted">•</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ZoneDetailsPanel(props) {
  return (
    <ErrorBoundary resetKeys={[props.zone?.id]}>
      <ZoneDetailsPanelContent {...props} />
    </ErrorBoundary>
  );
}

import React from 'react';
import { Activity } from 'lucide-react';
import StatusBadge from './StatusBadge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DynamicIcon } from '../utils/iconResolver';
import ErrorBoundary from './ErrorBoundary';
dayjs.extend(relativeTime);

const SuddenChangesContent = ({ changes, activeSignals, onSelectZone }) => {
  const safeChanges = Array.isArray(changes) ? changes : [];
  if (safeChanges.length === 0) return null;

  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 shrink-0">
      <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400">
        <Activity size={16} /> Emerging Changes
      </h3>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
        {safeChanges.map((c, i) => {
          const sig = (activeSignals || []).find(s => s.id === c.signalId);
          const iconName = sig?.icon || 'activity';
          const deltaVal = (c.to || 0) - (c.from || 0);
          const isUp = deltaVal > 0;
          
          let colorClass = 'text-amber-400';
          if (sig) {
            if (sig.higherIsWorse) colorClass = isUp ? 'text-amber-400' : 'text-green-400';
            else colorClass = isUp ? 'text-green-400' : 'text-amber-400';
          }

          const zoneIdString = c.zoneId ? String(c.zoneId).replace('zone-', 'Zone ').toUpperCase() : 'UNKNOWN';

          return (
            <div 
              key={c.id || `${c.zoneId}-${c.signalId}-${i}`}
              onClick={() => onSelectZone && onSelectZone(c.zoneId)}
              className="bg-[var(--navy-bg)] border border-[var(--navy-border)] p-3 rounded-lg flex items-start gap-3 hover:border-amber-500/50 cursor-pointer transition-colors"
            >
              <div className="mt-0.5 text-text-secondary">
                <DynamicIcon name={iconName} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm truncate">{zoneIdString}</span>
                  <StatusBadge status={c.severity} />
                </div>
                <div className="text-xs text-text-primary capitalize">{sig ? sig.label : c.signalId} spike</div>
                <div className="text-[10px] text-text-muted mt-1">Detected {dayjs(c.detectedAt).fromNow?.() || "recently"}</div>
              </div>
              <div className={`font-mono text-sm font-bold shrink-0 ${colorClass}`}>
                {isUp ? '+' : ''}{deltaVal} {sig?.unit || ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function SuddenChanges(props) {
  return (
    <ErrorBoundary resetKeys={[props.changes]}>
      <SuddenChangesContent {...props} />
    </ErrorBoundary>
  );
}

import React from 'react';
import StatusBadge from '../StatusBadge';
import dayjs from 'dayjs';

const ZoneHoverCard = ({ zoneId, mouseEvent, zones, mode, activeSignals }) => {
  if (!zoneId || !mouseEvent) return null;
  const zoneData = zones?.find(z => z.id === zoneId);
  if (!zoneData) return null;

  const style = {
    position: 'fixed',
    left: mouseEvent.clientX + 15,
    top: mouseEvent.clientY + 15,
    zIndex: 9999,
    pointerEvents: 'none'
  };

  const getStatus = () => {
    if (mode === 'overall') return zoneData.overall?.status || 'grey';
    return zoneData.signals?.[mode]?.status || 'grey';
  };

  const sigData = mode !== 'overall' && mode !== 'forecast' ? zoneData.signals?.[mode] : null;

  return (
    <div style={style} className="glass-panel p-3 rounded-lg min-w-[200px] shadow-2xl border-[var(--navy-border)]">
      <div className="flex justify-between items-center mb-2 gap-4">
        <span className="font-bold text-sm">{zoneData.name || 'Unknown'}</span>
        <StatusBadge status={getStatus()} />
      </div>
      
      {mode === 'overall' && Array.isArray(zoneData.overall?.drivers) && (
        <div className="text-xs text-text-secondary mt-1">
          <div className="font-semibold mb-1">Top Drivers:</div>
          {zoneData.overall.drivers.map((d, i) => {
            const sig = (activeSignals || []).find(s => s.id === d.signalId);
            return <div key={i}>• {sig ? sig.label : d.signalId} ({((d.weight || 0)*100).toFixed(0)}%)</div>;
          })}
        </div>
      )}

      {sigData && (
        <div className="text-xs text-text-secondary mt-1 flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Current:</span>
            <span className="font-mono text-text-primary font-bold">{sigData.value ?? '—'}</span>
          </div>
          <div className="text-[10px] text-text-muted">Updated: {sigData.updatedAt ? dayjs(sigData.updatedAt).format('HH:mm') : '—'}</div>
        </div>
      )}
    </div>
  );
};

export default ZoneHoverCard;

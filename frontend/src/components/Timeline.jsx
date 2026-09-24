import React from 'react';
import dayjs from 'dayjs';
import ErrorBoundary from './ErrorBoundary';

const TimelineContent = ({ events }) => {
  const safeEvents = Array.isArray(events) ? events : [];
  if (safeEvents.length === 0) {
    return <div className="text-sm text-text-muted italic">No recent events.</div>;
  }

  const getColor = (sev) => {
    switch (sev) {
      case 'red': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'amber': return 'bg-amber-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="flex flex-col gap-4 relative pl-3">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--navy-border)]"></div>
      
      {safeEvents.map((ev, i) => (
        <div key={ev.id || `${ev.t}-${ev.zoneId}-${i}`} className="relative pl-4">
          <div className={`absolute -left-[5px] top-1 w-3 h-3 rounded-full border-2 border-[var(--navy-bg)] ${getColor(ev.severity)} z-10`}></div>
          <div className="text-[10px] font-mono text-text-muted mb-0.5">{dayjs(ev.t).format('HH:mm')}</div>
          <div className="text-sm text-text-primary leading-tight">{ev.text}</div>
        </div>
      ))}
    </div>
  );
};

export default function Timeline(props) {
  return (
    <ErrorBoundary resetKeys={[props.events]}>
      <TimelineContent {...props} />
    </ErrorBoundary>
  );
}

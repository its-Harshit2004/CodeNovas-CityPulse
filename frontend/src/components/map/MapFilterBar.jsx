import React from 'react';
import { Layers } from 'lucide-react';

const MapFilterBar = ({ activeSignals, mode, onModeChange, showEvents, onToggleEvents }) => {
  const chips = [
    { id: 'overall', label: 'All Signals' },
    ...activeSignals.map(s => ({ id: s.id, label: s.label }))
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      <div className="glass-panel rounded-full px-3 py-1.5 flex items-center gap-2 drop-shadow-lg">
        <Layers size={14} className="text-text-muted" />
        <div className="flex gap-1">
          {chips.map(c => (
            <button 
              key={c.id} 
              onClick={() => onModeChange(c.id)}
              className={`text-xs px-3 py-1 rounded-full transition-colors font-medium border ${mode === c.id ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-transparent text-text-secondary border-transparent hover:bg-[var(--navy-panel-hover)]'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2 pl-2">
        <button 
          onClick={() => onToggleEvents(!showEvents)}
          className={`text-xs px-3 py-1 rounded-full transition-colors font-medium border glass-panel ${showEvents ? 'border-amber-500/50 text-amber-400' : 'text-text-secondary'}`}
        >
          Events {showEvents ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
};

export default MapFilterBar;

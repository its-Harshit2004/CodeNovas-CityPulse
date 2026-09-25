import React from 'react';

const MapLegend = ({ mode, activeSignals }) => {
  const title = mode === 'overall' ? 'Overall Status' : 
                mode === 'forecast' ? 'Predicted Status (+1h)' :
                `${activeSignals.find(s => s.id === mode)?.label || 'Signal'} Status`;

  return (
    <div className="absolute bottom-6 left-4 z-[1000] glass-panel p-3 rounded-lg text-xs drop-shadow-lg pointer-events-none">
      <div className="font-semibold mb-2 text-text-secondary">{title}</div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 border border-green-400"></span> Normal
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400"></span> Moderate
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-red-400 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> High Alert
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-500 border border-slate-400"></span> No Data
        </div>
      </div>
    </div>
  );
};

export default MapLegend;

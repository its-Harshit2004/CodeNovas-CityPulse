import React, { useContext } from 'react';
import { Cloud, Wind, Droplets, RefreshCw, AlertCircle } from 'lucide-react';
import { DataContext } from '../App';

const TopBar = () => {
  const { nextCheckIn, lastChecked, error, manualRefresh, resetDemo } = useContext(DataContext);

  return (
    <header className="h-16 glass-panel border-b border-x-0 border-t-0 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg hidden sm:block">Operations Command Center</h1>
        
        {/* Weather Strip */}
        <div className="hidden lg:flex items-center gap-4 text-sm text-text-secondary border-l border-[var(--navy-border)] pl-4">
          <span className="flex items-center gap-1"><Cloud size={14}/> —</span>
          <span className="flex items-center gap-1"><Wind size={14}/> —</span>
          <span className="flex items-center gap-1"><Droplets size={14}/> —</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {error ? (
          <div className="flex items-center gap-1 status-badge-amber px-2 py-1 rounded-full text-xs">
            <AlertCircle size={12}/> Connection issue, showing last data
          </div>
        ) : (
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Live · next check in {nextCheckIn}s</span>
          </div>
        )}
        
        <div className="text-text-muted font-mono text-xs hidden sm:block">
          Checked {lastChecked || '--:--:--'}
        </div>

        <button 
          onClick={manualRefresh}
          className="p-1.5 rounded-md hover:bg-[var(--navy-panel-hover)] text-text-secondary transition-colors"
          title="Manual Refresh"
        >
          <RefreshCw size={16} />
        </button>

        {import.meta.env.VITE_USE_MOCK === 'true' && (
          <button 
            onClick={resetDemo}
            className="text-xs border border-[var(--navy-border)] px-2 py-1 rounded hover:bg-[var(--navy-panel-hover)] text-text-muted transition-colors"
            title="Reset Demo Scenario"
          >
            Reset Demo
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;

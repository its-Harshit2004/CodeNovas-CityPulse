import { DynamicIcon } from '../utils/iconResolver';
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const KpiCard = ({ title, value, unit, delta, trend, icon, highlight }) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  const trendColor = highlight ? 'text-red-400' : (isUp ? 'text-amber-400' : (isDown ? 'text-green-400' : 'text-text-muted'));
  
  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group glass-panel-hover h-full">
      <div className="flex justify-between items-center text-text-secondary">
        <span className="text-sm font-medium">{title}</span>
        {icon && <DynamicIcon name={icon} size={16} className="text-text-muted opacity-50" />}
      </div>
      
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-bold font-mono tracking-tight text-text-primary">{value ?? '—'}</span>
        {unit && <span className="text-sm text-text-secondary">{unit}</span>}
      </div>

      <div className="flex items-center gap-1 mt-auto pt-2">
        <div className={`flex items-center text-xs font-medium ${trendColor}`}>
          {isUp ? <ArrowUpRight size={14}/> : isDown ? <ArrowDownRight size={14}/> : <Minus size={14}/>}
          {delta || '0'}
        </div>
        <span className="text-xs text-text-muted ml-1">vs prev</span>
      </div>
    </div>
  );
};

export default KpiCard;

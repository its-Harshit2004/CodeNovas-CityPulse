import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { DataContext } from '../App';
import { DynamicIcon } from '../utils/iconResolver';

const Sidebar = () => {
  const { activeSignals } = useContext(DataContext);

  const topNav = [
    { name: 'Dashboard', path: '/', icon: 'layout-dashboard' },
  ];
  
  const bottomNav = [
    { name: 'Analytics', path: '/analytics', icon: 'line-chart' },
  ];

  const safeSignals = Array.isArray(activeSignals) ? activeSignals : [];

  return (
    <aside className="w-16 md:w-60 glass-panel border-r border-y-0 border-l-0 flex flex-col shrink-0 z-20 transition-all overflow-y-auto">
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-[var(--navy-border)] shrink-0">
        <Activity className="text-blue-400 md:mr-2" size={24} />
        <span className="hidden md:inline font-bold text-lg tracking-tight">CityPulse</span>
      </div>
      
      <nav className="py-4 flex flex-col gap-2 px-2 md:px-4 shrink-0">
        {topNav.map((item) => (
          <SidebarLink key={item.name} item={item} />
        ))}
      </nav>

      {safeSignals.length > 0 && (
        <div className="px-4 py-2 hidden md:block">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Signals</div>
          <nav className="flex flex-col gap-1">
            {safeSignals.map(sig => (
              <SidebarLink key={sig.id} item={{ name: sig.label, path: `/signals/${sig.id}`, icon: sig.icon }} />
            ))}
          </nav>
        </div>
      )}

      <div className="px-4 py-2 hidden md:block mt-auto mb-4 border-t border-[var(--navy-border)] pt-4">
        <nav className="flex flex-col gap-1">
          {bottomNav.map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
};

const SidebarLink = ({ item }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center justify-center md:justify-start gap-3 p-2.5 rounded-md transition-all ${
        isActive 
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
          : 'text-text-secondary hover:bg-[var(--navy-panel-hover)] hover:text-text-primary border border-transparent'
      }`
    }
  >
    <DynamicIcon name={item.icon} size={16} />
    <span className="hidden md:inline font-medium text-sm">{item.name}</span>
  </NavLink>
);

export default Sidebar;

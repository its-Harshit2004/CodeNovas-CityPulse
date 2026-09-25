import React from 'react';

const StatusBadge = ({ status, className = "" }) => {
  const map = {
    green: { label: 'Normal', css: 'status-badge-green' },
    amber: { label: 'Moderate', css: 'status-badge-amber' },
    red: { label: 'High Alert', css: 'status-badge-red' },
    grey: { label: 'No Data', css: 'status-badge-grey' }
  };
  const s = map[status] || map.grey;
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${s.css} ${className}`}>
      {s.label}
    </span>
  );
};

export default StatusBadge;

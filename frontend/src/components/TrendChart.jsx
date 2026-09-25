import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import dayjs from 'dayjs';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-2 rounded text-xs border-[var(--navy-border)] shadow-xl">
        <p className="font-bold mb-1">{dayjs(label).format('HH:mm')}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="text-text-secondary">{entry.name}:</span>
            <span className="font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TrendLineChart = ({ data, lines, height = 200 }) => (
  <div style={{ height, width: '100%' }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="t" 
          stroke="#64748b" 
          tick={{ fill: '#64748b', fontSize: 10 }} 
          tickFormatter={(val) => dayjs(val).format('HH:mm')} 
        />
        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        {lines.map((l, i) => (
          <Line 
            key={i} 
            type="monotone" 
            dataKey={l.key} 
            name={l.name} 
            stroke={l.color} 
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const TrendBarChart = ({ data, bars, height = 200 }) => (
  <div style={{ height, width: '100%' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#64748b" 
          tick={{ fill: '#64748b', fontSize: 10 }} 
        />
        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        {bars.map((b, i) => (
          <Bar key={i} dataKey={b.key} name={b.name} fill={b.color} radius={[2,2,0,0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

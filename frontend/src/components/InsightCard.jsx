import React from 'react';
import { Sparkles } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

const InsightCardContent = ({ summary, confidence, generatedAt, intelligence }) => {
  if (!summary && !intelligence) return null;

  const intel = intelligence;

  return (
    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl relative">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-blue-400" />
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">CityPulse Insight</h3>
        {confidence && (
          <span className="ml-auto text-[10px] text-blue-300/70">
            {Math.round(confidence * 100)}% confidence
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-blue-50 mb-4">{intel ? intel.summary : summary}</p>
      
      {intel && (
        <div className="flex flex-col gap-4 border-t border-blue-500/20 pt-4 mt-2">
          {intel.contributors?.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1.5">Possible Contributors</h4>
              <ul className="flex flex-col gap-1 text-xs text-blue-100">
                {intel.contributors.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{c.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">Recent Trend</h4>
              <div className="text-xs font-medium text-blue-50 uppercase tracking-wider flex items-center gap-2">
                 {intel.trend === 'rising' ? '↑ Rising' : intel.trend === 'falling' ? '↓ Falling' : '→ Stable'}
              </div>
              <div className="text-[10px] text-blue-200/70 mt-0.5">{intel.trend_message}</div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">Short-Term Outlook</h4>
              <div className="text-xs font-medium text-blue-50 uppercase tracking-wider">{intel.outlook}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center text-[10px] text-blue-300/50 pt-2">
        <span>* Possible relationship, not confirmed cause.</span>
        {generatedAt && <span className="font-mono">{generatedAt.split('T')[1]?.substring(0,8)}</span>}
      </div>
    </div>
  );
};

export default function InsightCard(props) {
  return (
    <ErrorBoundary resetKeys={[props.summary]}>
      <InsightCardContent {...props} />
    </ErrorBoundary>
  );
}

import React from 'react';
import { Sparkles } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

const InsightCardContent = ({ summary, confidence, generatedAt }) => {
  if (!summary) return null;

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
      <p className="text-sm leading-relaxed text-blue-50">{summary}</p>
      
      <div className="mt-3 flex justify-between items-center text-[10px] text-blue-300/50 border-t border-blue-500/20 pt-2">
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

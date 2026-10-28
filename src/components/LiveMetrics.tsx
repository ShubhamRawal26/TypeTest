import React from 'react';
import { TypingMetrics, TestStatus, SavedResult } from '../types/typing';

interface LiveMetricsProps {
  status: TestStatus;
  timeRemaining: number;
  metrics: TypingMetrics;
  lastResult?: SavedResult | null;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({
  status,
  timeRemaining,
  metrics,
  lastResult,
}) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#1f2027] text-xs font-mono text-[#787c8f]">
      {/* Current live metrics */}
      <div className="flex items-center gap-6">
        {/* Time Remaining */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[#525666]">time</span>
          <span className="text-sm font-medium tabular-nums text-[#eef0f6]">
            {timeRemaining}s
          </span>
        </div>

        {/* WPM */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[#525666]">wpm</span>
          <span className="text-sm font-medium tabular-nums text-[#eef0f6]">
            {status === 'idle' ? '0' : metrics.wpm}
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[#525666]">acc</span>
          <span className="text-sm font-medium tabular-nums text-[#eef0f6]">
            {status === 'idle' ? '100%' : `${metrics.accuracy}%`}
          </span>
        </div>
      </div>

      {/* Saved last result */}
      {lastResult && (
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#525666]">
          <span>last result:</span>
          <span className="text-[#9398ab] font-medium tabular-nums">{lastResult.wpm} wpm</span>
          <span>·</span>
          <span className="text-[#787c8f] tabular-nums">{lastResult.accuracy}%</span>
        </div>
      )}
    </div>
  );
};

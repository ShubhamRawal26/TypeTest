import React from 'react';
import { TypingMetrics, Duration, SavedResult } from '../types/typing';
import { RotateCcw } from 'lucide-react';

interface ResultsViewProps {
  metrics: TypingMetrics;
  selectedDuration: Duration;
  lastResult?: SavedResult | null;
  onRestart: () => void;
  onSelectDuration: (d: Duration) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  metrics,
  selectedDuration,
  lastResult,
  onRestart,
  onSelectDuration,
}) => {
  const durations: Duration[] = [15, 30, 60];
  const roundedTime = Math.round(metrics.elapsedTime * 10) / 10;

  return (
    <div
      role="region"
      aria-label="Typing test results"
      className="w-full max-w-xl mx-auto py-8 animate-in fade-in duration-200"
    >
      <div className="bg-[#15161a] border border-[#23252d] rounded-2xl p-6 sm:p-8">
        {/* Top metrics row */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 pb-8 border-b border-[#21232b]">
          {/* WPM */}
          <div>
            <div className="text-xs font-mono text-[#787c8f] uppercase tracking-wider mb-1">
              Speed
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl sm:text-6xl font-semibold text-[#f1f2f6] tracking-tight tabular-nums">
                {metrics.wpm}
              </span>
              <span className="font-mono text-xs text-[#9d94ff]">
                wpm
              </span>
            </div>
            {metrics.rawWpm > metrics.wpm && (
              <div className="text-[11px] font-mono text-[#5c6072] mt-1 tabular-nums">
                raw {metrics.rawWpm} wpm
              </div>
            )}
          </div>

          {/* Accuracy */}
          <div>
            <div className="text-xs font-mono text-[#787c8f] uppercase tracking-wider mb-1">
              Accuracy
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl sm:text-6xl font-semibold text-[#f1f2f6] tracking-tight tabular-nums">
                {metrics.accuracy}
              </span>
              <span className="font-mono text-xs text-[#9d94ff]">
                %
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#5c6072] mt-1 tabular-nums">
              {metrics.correctChars} correct · {metrics.incorrectChars} incorrect
            </div>
          </div>
        </div>

        {/* Secondary metrics row */}
        <div className="grid grid-cols-3 gap-4 py-6 border-b border-[#21232b] text-center">
          <div>
            <div className="text-[11px] font-mono text-[#5c6072] mb-0.5">Time</div>
            <div className="font-mono text-sm font-medium text-[#c5c8d6] tabular-nums">
              {roundedTime}s
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-[#5c6072] mb-0.5">Characters</div>
            <div className="font-mono text-sm font-medium text-[#c5c8d6] tabular-nums">
              {metrics.correctChars}/{metrics.correctChars + metrics.incorrectChars}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-[#5c6072] mb-0.5">Keystrokes</div>
            <div className="font-mono text-sm font-medium text-[#c5c8d6] tabular-nums">
              {metrics.totalKeystrokes}
            </div>
          </div>
        </div>

        {/* Previous Session History Card if available */}
        {lastResult && (
          <div className="py-4 border-b border-[#21232b] flex items-center justify-between text-xs font-mono text-[#62677b]">
            <span className="text-[#525666]">Saved last session:</span>
            <div className="flex items-center gap-2 text-[#9398ab]">
              <span className="text-[#c5c8d6] font-medium">{lastResult.wpm} WPM</span>
              <span>·</span>
              <span>{lastResult.accuracy}%</span>
              <span>·</span>
              <span className="text-[#525666]">{lastResult.duration}s</span>
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          {/* Quick duration switch */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#787c8f]">
            <span className="text-[#525666] mr-1">Duration:</span>
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onSelectDuration(d)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedDuration === d
                    ? 'bg-[#23252f] text-[#f1f2f6] font-medium'
                    : 'text-[#6e7284] hover:text-[#c5c8d6]'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>

          {/* Try Again button */}
          <button
            type="button"
            onClick={() => onRestart()}
            autoFocus
            className="flex items-center gap-2 px-4 py-2 bg-[#23252f] hover:bg-[#2b2d39] text-[#f1f2f6] text-xs font-mono rounded-lg border border-[#2d303c] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9d94ff] group"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#9d94ff] group-hover:-rotate-45 transition-transform" />
            <span>Try again</span>
            <kbd className="ml-1 px-1 py-0.5 rounded bg-[#18191e] border border-[#2d303c] text-[10px] text-[#787c8f]">
              Tab
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
};

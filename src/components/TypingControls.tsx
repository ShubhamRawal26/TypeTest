import React from 'react';
import { Duration, TextMode } from '../types/typing';

interface TypingControlsProps {
  duration: Duration;
  textMode: TextMode;
  onSelectDuration: (d: Duration) => void;
  onSelectMode: (m: TextMode) => void;
}

export const TypingControls: React.FC<TypingControlsProps> = ({
  duration,
  textMode,
  onSelectDuration,
  onSelectMode,
}) => {
  const durations: Duration[] = [15, 30, 60];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2 text-xs font-mono">
      {/* Duration selector */}
      <div className="flex items-center gap-1 p-1 bg-[#16171b] border border-[#23252d] rounded-lg">
        {durations.map((d) => {
          const isSelected = duration === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => onSelectDuration(d)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-[#23252f] text-[#f1f2f6] font-medium shadow-xs'
                  : 'text-[#6e7284] hover:text-[#c5c8d6]'
              }`}
            >
              {d}s
            </button>
          );
        })}
      </div>

      {/* Case mode selector */}
      <div className="flex items-center gap-1 p-1 bg-[#16171b] border border-[#23252d] rounded-lg">
        <button
          type="button"
          onClick={() => onSelectMode('lowercase')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            textMode === 'lowercase'
              ? 'bg-[#23252f] text-[#f1f2f6] font-medium shadow-xs'
              : 'text-[#6e7284] hover:text-[#c5c8d6]'
          }`}
        >
          lowercase
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('uppercase')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            textMode === 'uppercase'
              ? 'bg-[#23252f] text-[#f1f2f6] font-medium shadow-xs'
              : 'text-[#6e7284] hover:text-[#c5c8d6]'
          }`}
        >
          UPPERCASE
        </button>
      </div>
    </div>
  );
};

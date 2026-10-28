import React from 'react';
import { RotateCcw } from 'lucide-react';
import { TestStatus } from '../types/typing';

interface FooterControlsProps {
  status: TestStatus;
  onRestart: () => void;
}

export const FooterControls: React.FC<FooterControlsProps> = ({
  status,
  onRestart,
}) => {
  return (
    <footer className="w-full max-w-4xl mx-auto flex items-center justify-between py-6 px-4 sm:px-6 text-xs font-mono text-[#525666]">
      {/* Restart quick button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onRestart()}
          aria-label="Restart typing test"
          title="Restart test (Tab)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#787c8f] hover:text-[#eef0f6] bg-[#16171b] hover:bg-[#20222a] border border-[#23252d] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9d94ff]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">restart</span>
        </button>
      </div>

      {/* Quiet shortcut reminders */}
      <div className="flex items-center gap-3 text-[11px] text-[#525666]">
        {status === 'running' ? (
          <span>typing in progress</span>
        ) : (
          <>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#16171b] border border-[#23252d] text-[#787c8f]">
                tab
              </kbd>{' '}
              restart
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#16171b] border border-[#23252d] text-[#787c8f]">
                esc
              </kbd>{' '}
              reset
            </span>
          </>
        )}
      </div>
    </footer>
  );
};

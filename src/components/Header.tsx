import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { SavedResult } from '../types/typing';

interface HeaderProps {
  lastResult?: SavedResult | null;
}

export const Header: React.FC<HeaderProps> = ({ lastResult }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-6 px-4 sm:px-6">
        {/* Brand wordmark */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl tracking-tight font-semibold text-white">
            type<span className="text-[#9d94ff]">.</span>
          </span>
          {lastResult && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#62677b] pl-3 border-l border-[#22242d]">
              <span>last:</span>
              <span className="text-[#c5c8d6] font-medium">{lastResult.wpm} wpm</span>
              <span className="text-[#4b4e5e]">·</span>
              <span className="text-[#9398ab]">{lastResult.accuracy}%</span>
            </span>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            aria-label="Typing test instructions and shortcuts"
            title="Shortcuts & Information"
            className="p-1.5 rounded-md text-[#9398ab] hover:text-[#eef0f6] bg-[#1a1b20] hover:bg-[#23252c] border border-[#27282f] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9d94ff]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Minimal macOS-style shortcut and information modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-dialog-title"
            className="w-full max-w-sm bg-[#16171b] border border-[#2a2c36] rounded-xl p-6 shadow-2xl text-[#c5c8d6] animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="info-dialog-title" className="text-sm font-semibold text-white tracking-wide">
                Keyboard Shortcuts & Engine
              </h2>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="p-1 text-[#9398ab] hover:text-white rounded transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed font-sans text-[#9398ab]">
              <div className="flex items-center justify-between py-1.5 border-b border-[#22242d]">
                <span className="text-[#c5c8d6]">Restart session</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#20222a] border border-[#2e313d] font-mono text-[11px] text-[#eef0f6]">
                  Tab
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#22242d]">
                <span className="text-[#c5c8d6]">Reset or stop</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#20222a] border border-[#2e313d] font-mono text-[11px] text-[#eef0f6]">
                  Esc
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#22242d]">
                <span className="text-[#c5c8d6]">Correction</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#20222a] border border-[#2e313d] font-mono text-[11px] text-[#eef0f6]">
                  Backspace
                </kbd>
              </div>

              <div className="pt-2 text-[11px] text-[#787c8f] space-y-1">
                <p>• Real mechanical switch sound enabled on physical typing.</p>
                <p>• Timer initiates automatically on the first character typed.</p>
                <p>• Uppercase mode requires exact case typing via Shift / CapsLock.</p>
                <p>• Accuracy: (Correct / Total Typed) × 100.</p>
                <p>• WPM: (Correct Characters / 5) / Elapsed Minutes.</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#22242d] flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="px-3.5 py-1.5 text-xs font-medium bg-[#23252e] hover:bg-[#2b2e3a] text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

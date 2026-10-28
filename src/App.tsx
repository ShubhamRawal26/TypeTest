/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useTypingEngine } from './hooks/useTypingEngine';
import { Header } from './components/Header';
import { TypingControls } from './components/TypingControls';
import { LiveMetrics } from './components/LiveMetrics';
import { TypingArea } from './components/TypingArea';
import { ResultsView } from './components/ResultsView';
import { FooterControls } from './components/FooterControls';

export default function App() {
  const {
    status,
    targetText,
    typedText,
    duration,
    textMode,
    timeRemaining,
    metrics,
    lastResult,
    inputRef,
    isInputFocused,
    setDuration,
    setTextMode,
    restartTest,
    handleKeyDown,
    handleInputChange,
    focusInput,
    setIsInputFocused,
  } = useTypingEngine();

  // Global window listener: redirect any non-functional keypress to the typing input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Allow modal / dialog or button focus to work normally
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'BUTTON' || activeEl.getAttribute('role') === 'dialog')) {
        if (e.key === 'Tab') {
          // Restart hotkey overrides tab
          e.preventDefault();
          restartTest();
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        restartTest();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        restartTest();
        return;
      }

      if (status !== 'completed' && document.activeElement !== inputRef.current) {
        // If it's a printable key or backspace, focus the input
        if (e.key.length === 1 || e.key === 'Backspace') {
          focusInput();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [focusInput, restartTest, status, inputRef]);

  return (
    <div className="min-h-screen bg-[#121316] text-[#e6e8ee] flex flex-col justify-between selection:bg-[#9d94ff]/25 selection:text-[#ffffff]">
      {/* Header with Wordmark and Last Result Summary */}
      <Header lastResult={lastResult} />

      {/* Main interactive area */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center my-6">
        {status === 'completed' ? (
          <ResultsView
            metrics={metrics}
            selectedDuration={duration}
            lastResult={lastResult}
            onRestart={() => restartTest()}
            onSelectDuration={setDuration}
          />
        ) : (
          <div className="space-y-4">
            {/* Top compact controls row */}
            <TypingControls
              duration={duration}
              textMode={textMode}
              onSelectDuration={setDuration}
              onSelectMode={setTextMode}
            />

            {/* Live Metrics bar with saved last result */}
            <LiveMetrics
              status={status}
              timeRemaining={timeRemaining}
              metrics={metrics}
              lastResult={lastResult}
            />

            {/* Central Typing Surface */}
            <div className="py-4">
              <TypingArea
                targetText={targetText}
                typedText={typedText}
                status={status}
                isInputFocused={isInputFocused}
                inputRef={inputRef}
                onFocus={focusInput}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={handleKeyDown}
                onInputChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer with minimal restart button and shortcut guides */}
      <FooterControls status={status} onRestart={() => restartTest()} />
    </div>
  );
}

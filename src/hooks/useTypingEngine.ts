import { useState, useEffect, useRef, useCallback } from 'react';
import { Duration, TextMode, TestStatus, TypingMetrics, SavedResult } from '../types/typing';
import { generatePassage } from '../utils/wordPool';
import { calculateAccuracy, calculateWpm, calculateRawWpm, evaluateCharacters } from '../utils/typingMetrics';
import { audioEngine } from '../utils/audioEngine';

interface UseTypingEngineReturn {
  status: TestStatus;
  targetText: string;
  typedText: string;
  duration: Duration;
  textMode: TextMode;
  timeRemaining: number;
  metrics: TypingMetrics;
  lastResult: SavedResult | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isInputFocused: boolean;
  setDuration: (d: Duration) => void;
  setTextMode: (m: TextMode) => void;
  restartTest: (newDuration?: Duration, newMode?: TextMode) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  focusInput: () => void;
  setIsInputFocused: (f: boolean) => void;
}

export function useTypingEngine(): UseTypingEngineReturn {
  const [duration, setDurationState] = useState<Duration>(30);
  const [textMode, setTextModeState] = useState<TextMode>('lowercase');
  const [status, setStatus] = useState<TestStatus>('idle');
  const [targetText, setTargetText] = useState<string>(() => generatePassage('lowercase', 30));
  const [typedText, setTypedText] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(true);

  // Load saved last result from localStorage
  const [lastResult, setLastResult] = useState<SavedResult | null>(() => {
    try {
      const stored = localStorage.getItem('type_last_result');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Performance metrics tracking
  const [metrics, setMetrics] = useState<TypingMetrics>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    elapsedTime: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalKeystrokes: 0,
  });

  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const timerFrameRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const totalKeystrokesRef = useRef<number>(0);
  const isFinishedRef = useRef<boolean>(false);

  // Stop active timer cleanly
  const stopTimer = useCallback(() => {
    if (timerFrameRef.current !== null) {
      cancelAnimationFrame(timerFrameRef.current);
      timerFrameRef.current = null;
    }
  }, []);

  // Finish test session, finalize metrics, and save last result
  const finishTest = useCallback((finalTyped: string, finalTarget: string) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    stopTimer();

    const finishTime = performance.now();
    endTimeRef.current = finishTime;
    const start = startTimeRef.current || finishTime;
    const elapsedSeconds = Math.max(0.1, (finishTime - start) / 1000);

    const { correctChars, incorrectChars } = evaluateCharacters(finalTarget, finalTyped);
    const finalWpm = calculateWpm(correctChars, elapsedSeconds);
    const finalRawWpm = calculateRawWpm(finalTyped.length, elapsedSeconds);
    const finalAccuracy = calculateAccuracy(correctChars, finalTyped.length);

    setStatus('completed');
    setTimeRemaining(0);
    setMetrics({
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      elapsedTime: elapsedSeconds,
      correctChars,
      incorrectChars,
      totalKeystrokes: totalKeystrokesRef.current,
    });

    // Save result to localStorage
    const saved: SavedResult = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      duration,
      textMode,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      localStorage.setItem('type_last_result', JSON.stringify(saved));
    } catch {
      // Ignore in restricted environments
    }

    setLastResult(saved);
  }, [duration, textMode, stopTimer]);

  // Animation frame countdown loop using wall-clock precision
  const startTimerLoop = useCallback((targetDuration: number, currentTarget: string) => {
    stopTimer();
    isFinishedRef.current = false;

    const tick = () => {
      if (isFinishedRef.current || !startTimeRef.current) return;

      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, targetDuration - elapsed);

      setTimeRemaining(Math.ceil(remaining));

      // Calculate live metrics on each frame
      setTypedText((currentTyped) => {
        const { correctChars, incorrectChars } = evaluateCharacters(currentTarget, currentTyped);
        const liveWpm = calculateWpm(correctChars, elapsed);
        const liveRawWpm = calculateRawWpm(currentTyped.length, elapsed);
        const liveAcc = calculateAccuracy(correctChars, currentTyped.length);

        setMetrics({
          wpm: liveWpm,
          rawWpm: liveRawWpm,
          accuracy: liveAcc,
          elapsedTime: elapsed,
          correctChars,
          incorrectChars,
          totalKeystrokes: totalKeystrokesRef.current,
        });

        return currentTyped;
      });

      if (remaining <= 0) {
        setTypedText((currentTyped) => {
          finishTest(currentTyped, currentTarget);
          return currentTyped;
        });
        return;
      }

      timerFrameRef.current = requestAnimationFrame(tick);
    };

    timerFrameRef.current = requestAnimationFrame(tick);
  }, [stopTimer, finishTest]);

  // Restart/reset the test session with dynamic paragraph length for duration
  const restartTest = useCallback((newDuration?: Duration, newMode?: TextMode) => {
    stopTimer();
    isFinishedRef.current = false;
    startTimeRef.current = null;
    endTimeRef.current = null;
    totalKeystrokesRef.current = 0;

    const isValidDuration =
      typeof newDuration === 'number' && (newDuration === 15 || newDuration === 30 || newDuration === 60);
    const effectiveDuration = isValidDuration ? newDuration : duration;

    const isValidMode =
      typeof newMode === 'string' && (newMode === 'lowercase' || newMode === 'uppercase');
    const effectiveMode = isValidMode ? newMode : textMode;

    const freshPassage = generatePassage(effectiveMode, effectiveDuration);
    setTargetText(freshPassage);
    setTypedText('');
    setStatus('idle');
    setTimeRemaining(effectiveDuration);

    setMetrics({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      elapsedTime: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalKeystrokes: 0,
    });

    // Re-focus hidden input
    setTimeout(() => {
      inputRef.current?.focus();
      setIsInputFocused(true);
    }, 10);
  }, [duration, textMode, stopTimer]);

  // Setting duration immediately updates paragraph length interactively
  const setDuration = useCallback((newD: Duration) => {
    setDurationState(newD);
    restartTest(newD, textMode);
  }, [restartTest, textMode]);

  // Setting mode (lowercase vs uppercase)
  const setTextMode = useCallback((newM: TextMode) => {
    setTextModeState(newM);
    restartTest(duration, newM);
  }, [restartTest, duration]);

  // Keyboard navigation & typing handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Quick restart shortcuts: Tab, Escape, or Shift+Enter
    if (e.key === 'Escape' || (e.key === 'Enter' && e.shiftKey) || e.key === 'Tab') {
      e.preventDefault();
      restartTest();
      return;
    }

    if (status === 'completed') {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        restartTest();
      }
      return;
    }

    // Prevent default scroll behavior on Spacebar
    if (e.key === ' ') {
      e.preventDefault();
    }

    // Play authentic mechanical key sound
    audioEngine.playKeySound(e.key);

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      audioEngine.playKeySound('Backspace');
      setTypedText((prev) => {
        if (prev.length === 0) return prev;
        const updated = prev.slice(0, -1);
        const { correctChars, incorrectChars } = evaluateCharacters(targetText, updated);
        const now = performance.now();
        const elapsed = startTimeRef.current ? Math.max(0.1, (now - startTimeRef.current) / 1000) : 0;
        setMetrics((m) => ({
          ...m,
          accuracy: calculateAccuracy(correctChars, updated.length),
          wpm: calculateWpm(correctChars, elapsed),
          correctChars,
          incorrectChars,
        }));
        return updated;
      });
      return;
    }

    // Ignore modifiers or functional keys (Shift, Alt, Meta, Ctrl, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    // Process single printable characters
    if (e.key.length === 1) {
      // CRITICAL: e.preventDefault() stops the browser from adding the char to <input>,
      // which would otherwise trigger a duplicate character via onChange!
      e.preventDefault();

      // Play authentic mechanical key sound
      audioEngine.playKeySound(e.key);

      // Start timer on first valid keypress
      if (status === 'idle') {
        startTimeRef.current = performance.now();
        setStatus('running');
        startTimerLoop(duration, targetText);
      }

      totalKeystrokesRef.current += 1;

      setTypedText((prev) => {
        if (prev.length >= targetText.length) {
          return prev;
        }

        const nextTyped = prev + e.key;

        if (nextTyped.length >= targetText.length) {
          setTimeout(() => {
            finishTest(nextTyped, targetText);
          }, 0);
        }

        return nextTyped;
      });
      return;
    }
  }, [status, duration, targetText, restartTest, startTimerLoop, finishTest]);

  // Handle mobile virtual keyboard / composition
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'completed') return;

    const val = e.target.value;
    e.target.value = '';

    if (!val) return;

    if (status === 'idle') {
      startTimeRef.current = performance.now();
      setStatus('running');
      startTimerLoop(duration, targetText);
    }

    const lastChar = val.slice(-1);
    audioEngine.playKeySound(lastChar);
    totalKeystrokesRef.current += 1;

    setTypedText((prev) => {
      if (prev.length >= targetText.length) return prev;
      const nextTyped = prev + lastChar;
      if (nextTyped.length >= targetText.length) {
        setTimeout(() => {
          finishTest(nextTyped, targetText);
        }, 0);
      }
      return nextTyped;
    });
  }, [status, duration, targetText, startTimerLoop, finishTest]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
    setIsInputFocused(true);
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  return {
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
  };
}

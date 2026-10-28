import React, { useMemo } from 'react';
import { TestStatus } from '../types/typing';

interface TypingAreaProps {
  targetText: string;
  typedText: string;
  status: TestStatus;
  isInputFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface WordToken {
  wordIndex: number;
  chars: {
    char: string;
    globalIndex: number;
  }[];
  spaceGlobalIndex: number | null;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  typedText,
  status,
  isInputFocused,
  inputRef,
  onFocus,
  onBlur,
  onKeyDown,
  onInputChange,
}) => {
  // Break down targetText into word tokens with exact global character indices
  const wordTokens = useMemo(() => {
    const tokens: WordToken[] = [];
    const words = targetText.split(' ');
    let runningIndex = 0;

    words.forEach((w, wIdx) => {
      const chars = [];
      for (let i = 0; i < w.length; i++) {
        chars.push({
          char: w[i],
          globalIndex: runningIndex,
        });
        runningIndex++;
      }

      const hasTrailingSpace = wIdx < words.length - 1;
      const spaceIndex = hasTrailingSpace ? runningIndex : null;
      if (hasTrailingSpace) {
        runningIndex++;
      }

      tokens.push({
        wordIndex: wIdx,
        chars,
        spaceGlobalIndex: spaceIndex,
      });
    });

    return tokens;
  }, [targetText]);

  const currentIndex = typedText.length;

  return (
    <div
      onClick={onFocus}
      role="region"
      aria-label="Typing test text area"
      className="relative w-full cursor-text select-none py-6 transition-all duration-150 outline-none"
    >
      {/* Hidden input to capture physical keyboard and mobile IME input */}
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onInputChange}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        aria-label="Typing input field"
      />

      {/* Subtle unfocused backdrop notification */}
      {!isInputFocused && status !== 'completed' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#121316]/75 backdrop-blur-xs rounded-lg transition-opacity duration-200 pointer-events-none">
          <div className="px-4 py-2 bg-[#1a1b20] border border-[#2b2d37] rounded-lg text-xs font-mono text-[#c5c8d6] shadow-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9d94ff]"></span>
            <span>Click or press any key to focus</span>
          </div>
        </div>
      )}

      {/* Rendered Monospace Text with Character State & Caret */}
      <div
        className={`font-mono text-lg sm:text-xl md:text-2xl leading-[2.2rem] tracking-wide transition-opacity duration-200 flex flex-wrap content-start ${
          isInputFocused ? 'opacity-100' : 'opacity-40'
        }`}
      >
        {wordTokens.map((token) => (
          <div key={token.wordIndex} className="inline-flex items-baseline">
            {/* Word characters */}
            {token.chars.map((item) => {
              const isTyped = item.globalIndex < currentIndex;
              const isCurrent = item.globalIndex === currentIndex;
              let charStyle = 'text-[#454959]'; // Untyped muted grey

              if (isTyped) {
                const typedChar = typedText[item.globalIndex];
                if (typedChar === item.char) {
                  charStyle = 'text-[#f1f2f6]'; // Soft white correct
                } else {
                  charStyle = 'text-[#f87171] border-b border-[#f87171]/80 bg-[#f87171]/10 rounded-xs'; // Restrained red incorrect
                }
              }

              return (
                <span
                  key={item.globalIndex}
                  className="relative inline-block"
                >
                  {/* Caret before current character */}
                  {isCurrent && status !== 'completed' && isInputFocused && (
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.5px] top-[12%] bottom-[12%] w-[2px] bg-[#9d94ff] rounded-full z-10 ${
                        status === 'idle' ? 'animate-caret' : ''
                      }`}
                    />
                  )}
                  <span className={`${charStyle} transition-colors duration-75`}>
                    {item.char}
                  </span>
                </span>
              );
            })}

            {/* Inter-word Space */}
            {token.spaceGlobalIndex !== null && (
              <span
                key={token.spaceGlobalIndex}
                className="relative inline-block w-[1ch]"
              >
                {/* Caret at space position */}
                {token.spaceGlobalIndex === currentIndex && status !== 'completed' && isInputFocused && (
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[1.5px] top-[12%] bottom-[12%] w-[2px] bg-[#9d94ff] rounded-full z-10 ${
                      status === 'idle' ? 'animate-caret' : ''
                    }`}
                  />
                )}
                {token.spaceGlobalIndex < currentIndex ? (
                  typedText[token.spaceGlobalIndex] === ' ' ? (
                    <span className="inline-block w-[1ch] text-transparent">&nbsp;</span>
                  ) : (
                    // User typed something else instead of space
                    <span className="inline-block w-full border-b border-[#f87171] bg-[#f87171]/15 text-[#f87171] text-center text-xs">
                      _
                    </span>
                  )
                ) : (
                  <span className="inline-block w-[1ch] text-transparent">&nbsp;</span>
                )}
              </span>
            )}
          </div>
        ))}

        {/* Caret when user reaches the very end */}
        {currentIndex >= targetText.length && status !== 'completed' && isInputFocused && (
          <span
            aria-hidden="true"
            className="inline-block w-[2px] h-[1.3em] bg-[#9d94ff] rounded-full animate-caret ml-0.5"
          />
        )}
      </div>
    </div>
  );
};

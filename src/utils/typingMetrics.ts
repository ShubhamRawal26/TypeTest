/**
 * Typing Metrics & Validation Utilities
 *
 * Accuracy Policy:
 * Accuracy is calculated as: (Correct Characters / Current Typed Length) * 100.
 * Backspacing removes characters from the active typed buffer, allowing the typist
 * to correct errors and recover accuracy. Total physical keystrokes and raw character counts
 * are also tracked for comprehensive post-test analysis.
 */

export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars <= 0) {
    return 100;
  }
  const rawAcc = (correctChars / totalTypedChars) * 100;
  return Math.min(100, Math.max(0, Math.round(rawAcc * 10) / 10));
}

export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 1 || correctChars < 2) {
    return 0;
  }
  const elapsedMinutes = elapsedSeconds / 60;
  const wpm = (correctChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(wpm));
}

export function calculateRawWpm(totalTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 1 || totalTypedChars < 2) {
    return 0;
  }
  const elapsedMinutes = elapsedSeconds / 60;
  const rawWpm = (totalTypedChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(rawWpm));
}

export interface CharacterCounts {
  correctChars: number;
  incorrectChars: number;
}

export function evaluateCharacters(target: string, typed: string): CharacterCounts {
  let correct = 0;
  let incorrect = 0;

  const compareLength = Math.min(target.length, typed.length);
  for (let i = 0; i < compareLength; i++) {
    if (typed[i] === target[i]) {
      correct++;
    } else {
      incorrect++;
    }
  }

  // If user somehow typed beyond target length
  if (typed.length > target.length) {
    incorrect += typed.length - target.length;
  }

  return {
    correctChars: correct,
    incorrectChars: incorrect,
  };
}

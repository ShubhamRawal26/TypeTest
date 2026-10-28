export type Duration = 15 | 30 | 60;
export type TextMode = 'lowercase' | 'uppercase';
export type TestStatus = 'idle' | 'running' | 'completed';

export interface TypingMetrics {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedTime: number; // in seconds
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
}

export interface SavedResult {
  wpm: number;
  accuracy: number;
  duration: Duration;
  textMode: TextMode;
  timestamp: number;
  dateStr: string;
}

export interface CharacterState {
  char: string;
  expected: string;
  status: 'correct' | 'incorrect' | 'current' | 'untyped';
}

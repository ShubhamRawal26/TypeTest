import { TextMode, Duration } from '../types/typing';

/**
 * Curated pool of common, pleasant English words with zero punctuation.
 * No periods, commas, apostrophes, hyphens, or symbols.
 */
export const WORD_POOL = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'a', 'quiet', 'little', 'house',
  'where', 'people', 'learn', 'build', 'create', 'things', 'every', 'day', 'simple', 'ideas',
  'become', 'useful', 'when', 'we', 'practice', 'with', 'patience', 'focus', 'and', 'time',
  'great', 'work', 'comes', 'from', 'small', 'steps', 'taken', 'consistently', 'without', 'rush',
  'clear', 'thoughts', 'lead', 'to', 'better', 'actions', 'in', 'moments', 'of', 'calm',
  'read', 'write', 'think', 'listen', 'observe', 'reflect', 'grow', 'move', 'forward', 'always',
  'light', 'shadow', 'morning', 'breeze', 'still', 'water', 'deep', 'forest', 'open', 'road',
  'clean', 'code', 'sharp', 'tools', 'steady', 'hands', 'thoughtful', 'design', 'true', 'craft',
  'keyboard', 'screen', 'window', 'desk', 'coffee', 'notebook', 'pencil', 'blank', 'page', 'flow',
  'first', 'second', 'minute', 'hour', 'rhythm', 'pace', 'balance', 'clarity', 'effort', 'result',
  'discover', 'explore', 'invent', 'shape', 'guide', 'share', 'help', 'kind', 'honest', 'calm',
  'modern', 'minimal', 'subtle', 'refined', 'silent', 'gentle', 'warmth', 'depth', 'space', 'motion',
  'keep', 'going', 'stay', 'present', 'breathe', 'smooth', 'natural', 'effortless', 'pure', 'sound',
  'river', 'mountain', 'cloud', 'sky', 'silver', 'bright', 'stone', 'path', 'valley', 'wind',
  'energy', 'spark', 'wonder', 'memory', 'vision', 'future', 'present', 'listen', 'smile', 'warm',
  'signal', 'harbor', 'island', 'journey', 'canvas', 'summer', 'winter', 'autumn', 'spring', 'dawn'
];

/**
 * Maps duration to an appropriate word count so changing duration visibly
 * and interactively scales the paragraph length.
 * 15s -> ~30 words (compact, fast sprint)
 * 30s -> ~70 words (medium paragraph)
 * 60s -> ~135 words (deep endurance test)
 */
export function getWordCountForDuration(duration: Duration = 30): number {
  switch (duration) {
    case 15:
      return 32;
    case 30:
      return 70;
    case 60:
      return 135;
    default:
      return 70;
  }
}

/**
 * Generates a randomized, readable passage without duplicate adjacent words.
 * Scaled dynamically based on duration and mode.
 */
export function generatePassage(mode: TextMode = 'lowercase', duration: Duration = 30): string {
  const targetWordCount = getWordCountForDuration(duration);
  const words: string[] = [];
  let lastWord = '';

  for (let i = 0; i < targetWordCount; i++) {
    let candidate: string;
    do {
      const randomIndex = Math.floor(Math.random() * WORD_POOL.length);
      candidate = WORD_POOL[randomIndex];
    } while (candidate === lastWord && WORD_POOL.length > 1);

    words.push(candidate);
    lastWord = candidate;
  }

  const rawText = words.join(' ');
  return mode === 'uppercase' ? rawText.toUpperCase() : rawText.toLowerCase();
}

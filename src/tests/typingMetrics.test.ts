import assert from 'node:assert';
import {
  calculateAccuracy,
  calculateWpm,
  calculateRawWpm,
  evaluateCharacters,
} from '../utils/typingMetrics';
import { generatePassage } from '../utils/wordPool';

console.log('Running typing engine tests...');

// 1. Accuracy Calculation Tests
{
  // Empty input -> 100% accuracy without division by zero
  assert.strictEqual(calculateAccuracy(0, 0), 100, 'Empty input should yield 100% accuracy');

  // 100% correct
  assert.strictEqual(calculateAccuracy(50, 50), 100, 'All correct chars should yield 100%');

  // 45 correct out of 50 total typed
  assert.strictEqual(calculateAccuracy(45, 50), 90, '45/50 should yield 90%');

  // Rounding test: 33 out of 34
  const acc = calculateAccuracy(33, 34);
  assert.strictEqual(acc, 97.1, '33/34 should round to 97.1%');
}

// 2. WPM Calculation Tests
{
  // Less than 1 second elapsed -> should return 0 (avoiding early volatile spikes)
  assert.strictEqual(calculateWpm(5, 0.4), 0, 'Sub-1-second elapsed time should return 0');

  // Standard calculation: 50 correct characters in 30 seconds
  // (50 / 5) = 10 words. 10 words in 0.5 minutes = 20 WPM.
  assert.strictEqual(calculateWpm(50, 30), 20, '50 correct chars in 30s should be 20 WPM');

  // 300 correct characters in 60 seconds -> 60 WPM
  assert.strictEqual(calculateWpm(300, 60), 60, '300 correct chars in 60s should be 60 WPM');

  // Raw WPM test: 320 total keystrokes in 60s -> 64 raw WPM
  assert.strictEqual(calculateRawWpm(320, 60), 64, '320 total chars in 60s should be 64 raw WPM');
}

// 3. Character Matching & Evaluation Tests
{
  const target = 'the quick brown fox';
  const typedCorrect = 'the quick';
  const res1 = evaluateCharacters(target, typedCorrect);
  assert.strictEqual(res1.correctChars, 9, 'All 9 characters should be correct');
  assert.strictEqual(res1.incorrectChars, 0, 'No incorrect characters');

  // Mistake in the middle
  const typedWithMistake = 'the qxick';
  const res2 = evaluateCharacters(target, typedWithMistake);
  assert.strictEqual(res2.correctChars, 8, '8 correct characters');
  assert.strictEqual(res2.incorrectChars, 1, '1 incorrect character (x instead of u)');

  // Backspacing simulation
  // Typed 'the qx', then backspace to 'the q', then type 'u' -> 'the qu'
  const backspaced = 'the qu';
  const res3 = evaluateCharacters(target, backspaced);
  assert.strictEqual(res3.correctChars, 6, 'Backspace restores correct character evaluation');
  assert.strictEqual(res3.incorrectChars, 0, 'No errors remain after backspace');
}

// 4. Passage Generation, Punctuation-Free & Dynamic Length
{
  const passage15 = generatePassage('lowercase', 15);
  const passage30 = generatePassage('lowercase', 30);
  const passage60 = generatePassage('lowercase', 60);

  // Assert no punctuation characters exist
  assert.doesNotMatch(passage15, /[.,;:'"!?\-_]/, 'Passage must contain no punctuation marks');
  assert.doesNotMatch(passage30, /[.,;:'"!?\-_]/, 'Passage must contain no punctuation marks');
  assert.doesNotMatch(passage60, /[.,;:'"!?\-_]/, 'Passage must contain no punctuation marks');

  // Assert dynamic length scaling
  const words15 = passage15.split(' ').length;
  const words30 = passage30.split(' ').length;
  const words60 = passage60.split(' ').length;

  assert.strictEqual(words15 < words30, true, '15s paragraph must be shorter than 30s');
  assert.strictEqual(words30 < words60, true, '30s paragraph must be shorter than 60s');

  const upperPassage = generatePassage('uppercase', 30);
  assert.strictEqual(upperPassage, upperPassage.toUpperCase(), 'Uppercase mode produces uppercase passage');

  // Validate uppercase typing enforcement
  const targetUpper = 'THE QUICK';
  const typedLower = 'the';
  const evalCase = evaluateCharacters(targetUpper, typedLower);
  assert.strictEqual(evalCase.correctChars, 0, 'Lowercase input against uppercase target must count as errors');
  assert.strictEqual(evalCase.incorrectChars, 3, 'All 3 chars mismatched due to case sensitivity');
}

console.log('✓ All typing engine unit tests passed successfully!');

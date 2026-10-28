# type. — Minimal Typing Test

A calm, refined typing test utility inspired by the visual restraint of macOS, Apple Notes, and modern developer tools. Built with a genuine typing engine, real-time character evaluation, tactile Web Audio mechanical sound synthesis, and zero unnecessary distractions.

---

## Features

### 1. Visual & Interaction Design
- **macOS Minimalist Aesthetic**: Deep charcoal (`#121316`) canvas, soft white primary text (`#f1f2f6`), and a quiet warm lavender accent (`#9d94ff`).
- **Precision Typography**: Clean monospace font (JetBrains Mono) with comfortable line height, distinct untyped/correct/incorrect states, and a smooth blinking caret.
- **Natural Word Wrapping**: Text tokens preserve whole-word boundaries at line wraps to avoid awkward hyphenation mid-word.
- **Uncluttered Focus**: No marketing banners, extraneous gamification, floating badges, or decorative fluff.

### 2. Real Typing Engine
- **Accurate Wall-Clock Timer**: Driven by `performance.now()`, ensuring high-precision countdowns unaffected by JavaScript thread stalls. Countdown stops exactly at zero and never goes negative.
- **Documented Accuracy Policy**:
  $$\text{Accuracy} = \left(\frac{\text{Correct Characters}}{\text{Current Typed Length}}\right) \times 100$$
  Backspace removes mistakes from the active buffer, enabling typists to correct errors and restore accuracy. Total raw keystrokes are preserved in session statistics.
- **Standard Net WPM Calculation**:
  $$\text{WPM} = \frac{\text{Correct Characters} / 5}{\text{Elapsed Minutes}}$$
  Uses actual elapsed time. Stabilized during the first second to prevent initial volatile spikes.
- **Case Modes**:
  - `lowercase`: Targets lowercase vocabulary.
  - `UPPERCASE`: Targets uppercase vocabulary and strictly enforces uppercase keystroke input (requires `Shift` or `CapsLock`; does not auto-convert).
- **Duration Options**: 15s, 30s (default), and 60s.

### 3. Web Audio Keyboard Sound Engine
- **Synthesized Mechanical Switch Sound**: Uses the Web Audio API to produce an authentic, quiet key-tap sound (transient noise click + keycap bottom-out resonance).
- **Natural Tactile Variance**: Includes slight randomized pitch jitter ($\pm 5\%$) per keypress, with acoustic tuning for Spacebar and Backspace.
- **Zero External Assets**: 100% synthesized in real time.
- **Browser Audio Context Compliance**: Initializes only upon explicit user gesture; muted by default with preference persisted to `localStorage`.

### 4. Keyboard Shortcuts
- `Tab`: Instantly restart with a fresh passage.
- `Esc`: Stop and reset current session.
- `Backspace`: Delete previous character.
- Click anywhere or press any key to focus.

---

## Project Structure

```
├── index.html                   # HTML entry point with fonts & metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
└── src/
    ├── main.tsx                 # Application mount
    ├── App.tsx                  # Main layout and global shortcut router
    ├── index.css                # Tailwind theme and custom caret animations
    ├── types/
    │   └── typing.ts            # Type definitions for engine & metrics
    ├── utils/
    │   ├── audioEngine.ts       # Web Audio API mechanical key synthesizer
    │   ├── typingMetrics.ts     # WPM, accuracy, and character matching logic
    │   └── wordPool.ts          # Curated word pool & randomized passage generator
    ├── hooks/
    │   └── useTypingEngine.ts   # Core typing engine hook and lifecycle management
    ├── components/
    │   ├── Header.tsx           # Wordmark, sound toggle, shortcut modal
    │   ├── TypingControls.tsx   # Duration and case segmented selector
    │   ├── LiveMetrics.tsx      # Unobtrusive live WPM, accuracy, and countdown
    │   ├── TypingArea.tsx       # Centerpiece text display, caret, and input capture
    │   ├── ResultsView.tsx      # macOS-style results summary card
    │   └── FooterControls.tsx   # Subtle restart button & shortcut indicators
    └── tests/
        └── typingMetrics.test.ts # Automated unit tests for engine calculations
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development
Start the local development server on port 3000:
```bash
npm run dev
```

### Running Tests
Run the automated test suite verifying accuracy, WPM calculations, and session transitions:
```bash
npm test
```

### Production Build
Build the optimized client-side bundle:
```bash
npm run build
```

---

## Deploying to GitHub Pages (GitHub Actions)

This repository includes a production-ready GitHub Actions workflow at `.github/workflows/deploy.yml`.

### Quick Setup:
1. **Push your code to GitHub**:
   - Push this repository to your GitHub account (make sure the GitHub App has workflow permissions if prompted).
2. **Enable GitHub Actions for Pages**:
   - In your repository on GitHub.com, go to **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. **Automatic Deployment**:
   - Every push to `main` will automatically run tests, build the bundle, and deploy to your GitHub Pages URL (`https://<your-username>.github.io/<your-repo-name>/`).
   - You can also manually trigger a deployment from the **Actions** tab by choosing **Deploy to GitHub Pages** > **Run workflow**.


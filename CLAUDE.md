# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Math Monstars is an educational math game built with React, TypeScript, and Vite. Players collect and care for pets (each representing a multiplication fact), feeding them by solving math problems. The game uses a spaced repetition system (inspired by FSRS) where pets get hungry over time based on their "stability" stat.

## Development Commands

```bash
# Install dependencies
npm i

# Start dev server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build in development mode (with component tagger)
npm run build:dev

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Lint code
npm run lint
```

## Project Setup

- **Project scaffolded from Lovable** (lovable.dev) - a platform that can generate code via prompts
- **Tech stack**: Vite + React + TypeScript + shadcn-ui + Tailwind CSS
- **Path alias**: `@/` maps to `./src/`
- **TypeScript**: Configured with relaxed rules (noImplicitAny: false, strictNullChecks: false)
- **Test framework**: Vitest with jsdom environment, tests in `src/**/*.{test,spec}.{ts,tsx}`

## Architecture

### Core Game Loop

1. **State Management** (`src/hooks/useGameState.ts`):
   - Central game state hook managing coins, pets, equipped pets, and current zone
   - Auto-saves to localStorage on every state change (key: `math-monstars-save`)
   - Auto-decreases pet hunger every 30 seconds (hunger decreases faster for pets with lower stability)

2. **Pet System** (`src/types/game.ts`, `src/data/pets.ts`):
   - Each pet represents a multiplication fact (e.g., "2×3 Twin-Pup")
   - Pets have hunger (0-100), rank (bronze/gold/diamond/neon), stability (FSRS-inspired), and performance stats
   - Rank upgrades based on answer speed: <2s=neon, <3s=diamond, <5s=gold, else bronze
   - Players start with 8 pets covering various multiplication facts

3. **Game Screens** (all managed in `src/pages/Index.tsx`):
   - **Main Menu**: Entry point to start playing
   - **Pet Pen**: Feed hungry pets by solving their math facts, increases hunger and stability
   - **Math Mine**: Use equipped pets (max 3) to mine blocks by solving problems, earn gems
   - **Pet Collection**: View all pets, toggle equipment status (max 3 equipped)
   - **Leaderboard**: View pet performance statistics
   - **Bottom Navigation**: Switches between screens, shows hungry pet count badge

### Key Components

- **AnswerBubbles** (`src/components/game/AnswerBubbles.tsx`): Multiple choice answer interface with timer
- **GameHUD** (`src/components/game/GameHUD.tsx`): Top bar showing coins, streak, and zone
- **useGameState** hook: Contains all game logic (feeding, mining, equipping, rank calculation)

### Data Flow

```
Index.tsx (main page)
  ├─> useGameState() hook (state + actions)
  │     ├─> localStorage (auto-save)
  │     └─> setInterval (hunger decay)
  │
  ├─> Conditional screen rendering based on currentScreen
  │     ├─> PetPen: displays all pets, allows feeding
  │     ├─> MathMine: displays mine blocks, uses equipped pets
  │     ├─> PetCollection: displays all pets with equip toggles
  │     └─> Leaderboard: displays pet stats
  │
  └─> BottomNav: switches between screens
```

### Math Fact Generation

- Pets are grouped into "families" (twos, threes, fours, etc.) based on the smaller factor
- Each family has themed names and emojis (e.g., twos family: Twin-Pup 🐕, Double-Dino 🦖)
- Wrong answers are generated randomly within ±10 of correct answer
- Division facts use a separate "division" family

## Important Notes

- The game state persists across sessions via localStorage
- Equipped pets are limited to 3 at a time
- Hunger decreases faster for pets with lower stability (incentivizes mastering facts)
- Correct answers increase stability and hunger; wrong answers decrease both
- Component tagger (lovable-tagger) only runs in development mode

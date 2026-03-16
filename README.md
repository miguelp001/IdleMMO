# IdleRPG - Fantasy MMORPG

A modern React-based MMORPG engine featuring persistent progression, a robust state management system, and automated gameplay mechanics. Built with React 18, TypeScript, and Vite, IdleRPG focuses on providing a scalable foundation for idle-style role-playing games.

## ⚙️ How It Works

IdleRPG is built on a custom game engine architecture designed for efficiency and persistence.

### 1. Centralized State Management
The entire game state is managed through a single **Redux-style Reducer** and **React Context**. This ensures that all components (Character Sheet, Inventory, Combat, Dungeons) stay perfectly in sync.
- **Reducer**: Handles complex state transitions (adding XP, equipping items, processing combat turns).
- **Context**: Provides global access to the state and dispatch function throughout the component tree.

### 2. The Engine Heart: `useGameTimer`
The core game loop is driven by a custom high-precision timer hook.
- **Game Ticks**: The engine processes ticks every 100ms.
- **Dynamic Timers**: Supports multiple independent timers for cooldowns, world events, and resource regeneration.
- **Idle Progression**: When active, the engine calculates "Idle Gains" based on levels and stats, ensuring progress continues even during passive play.

### 3. Automated Dungeon Exploration
The dungeon system uses procedural generation to create a varied crawling experience.
- **Room-Based Crawling**: Dungeons now feature distinct rooms (Combat, Rest, Treasure, Boss) with procedural generation.
- **Auto-Drive**: Characters navigate through rooms automatically following a generated path.
- **Event Triggers**: Automated handling of enemies, treasure claims, and boss encounters.

### 4. Persistence & Portability
- **Auto-Save**: The `useSaveSystem` hook maintains state in `localStorage` at regular intervals.
- **Data Integrity**: Save data includes versioning and timestamp validation to prevent corruption during updates.
- **Export/Import**: Players can export their entire game state as a Base64 string for backup or transferring between devices.

## 🎮 Features & Mechanics

### Core Game Systems (Implemented ✅)

#### 🛡️ Character System
- **Creation**: Choice of 4 base classes (Warrior, Mage, Rogue, Cleric) with specialized starting stats.
- **Progression**: Automatic leveling system with stat scaling (Health, Mana, Attack, Defense, etc.).
- **Inventory**: Slot-based equipment system and stackable item management.

#### ⚔️ Combat Resolution
- **Turn-Based Engine**: Automated battle processing with damage and defense calculations.
- **Loot System**: Dynamic rewards based on enemy levels and loot tables.

#### 🗺️ Dungeon Exploration
- **Room-Based Logic**: Advanced room types for more engaging crawls.
- **Procedural Layouts**: Unique dungeon paths for every run.
- **Boss Encounters**: Specialized high-tier combat to finalize dungeon runs.

#### 🏰 Guild Foundations
- **Guild Passives**: Passive stat bonuses scaled by Guild Level (0.5% per level).
- **Guild Roster**: Dedicated hall members storage for recruited adventurers.
- **Recruitment**: Direct recruitment from the tavern into the Guild Hall.

#### 💾 Persistence Layer
- **Auto-Sync**: Background saving to `localStorage`.
- **Portability**: Full Base64 export/import of character and world data.

### Planned Features (In Development 🚧)

#### 👥 Social Systems
- **NPC Interactions**: Advanced dialogue trees and relationship building.
- **World Events**: Global modifiers that affect all players temporarily.

#### 🌳 Generational Gameplay (Next Phase 🚀)
- **Family Trees**: Lineage tracking and trait inheritance across generations.
- **Marriage**: Social bonds between characters.
- **Heir Selection**: Passing the torch to the next generation with legacy bonuses.

#### 🏆 Advanced Progression
- **Specializations**: Higher-tier class advancements (e.g., Paladin, Necromancer).
- **Achievements**: Global challenge tracking with unique rewards.

## 🏗️ Project Structure

```
src/
├── components/          # UI View Layer
├── context/            # Global State Provider
├── hooks/              # Engine Core Logic
├── reducers/           # State Transition Logic
├── types/              # Domain Models
└── utils/              # Helper utilities
```

## 🚀 Roadmap

### ✅ Completed: Phase 2 (Dungeon & Guild)
- [x] Automated Exploration Engine
- [x] Room-based Dungeon Scaling
- [x] Guild Recruitment & Passive Stats
- [x] Achievement Foundation

### 🎯 Current Focus: Phase 3 (Social & Generational)
- [ ] **NPC Dialogue System** (Advanced interactions)
- [ ] **Family Tree Visualization** (Legacy tracking)
- [ ] **Heir Selection** (Generational transition)
- [ ] **World Events Loop** (Dynamic global modifiers)
- [ ] **Achievement Engine** (Full challenge suite)

## 🐛 Known Issues & Limitations
- **Skeletons**: `FamilyTree.tsx` is currently a UI placeholder.
- **State Migration**: Breaking changes in `types/game.ts` may require clearing `localStorage`.
- **Combat Animations**: Battles are currently resolved through log updates; visual animations are planned.

---

**Happy Gaming! 🎮✨**
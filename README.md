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
The dungeon system uses a path-finding algorithm (linear or node-based) to automate exploration.
- **Auto-Discovery**: As the character moves, tiles are automatically revealed.
- **Encounter Logic**: The engine triggers automatic combat or loot events when the character enters specific room types.
- **Combat Resolution**: Combat is handled through a turn-based resolution engine that calculates outcomes based on player and enemy stats.

### 4. Persistence & Portability
- **Auto-Save**: The `useSaveSystem` hook maintains state in `localStorage` at regular intervals.
- **Data Integrity**: Save data includes versioning and timestamp validation to prevent corruption during updates.
- **Export/Import**: Players can export their entire game state as a Base64 string for backup or transferring between devices.## 🎮 Features & Mechanics

### Core Game Systems (Implemented ✅)

#### 🛡️ Character System
- **Creation**: Choice of 4 base classes (Warrior, Mage, Rogue, Cleric) with specialized starting stats.
- **Progression**: Automatic leveling system with stat scaling (Health, Mana, Attack, Defense, etc.).
- **Inventory**: Slot-based equipment system and stackable item management.

#### ⚔️ Combat Resolution
- **Turn-Based Engine**: Automated battle processing with damage and defense calculations.
- **Loot System**: Dynamic rewards based on enemy levels and loot tables.

#### 🗺️ Dungeon Exploration
- **Auto-Drive**: Characters navigate a 7x7 grid automatically following a generated path.
- **Fog of War**: Discovery mechanics that reveal tiles as the player explores.
- **Event Triggers**: Automated handling of enemies, treasure, and exit tiles.

#### 💾 Persistence Layer
- **Auto-Sync**: Background saving to `localStorage`.
- **Portability**: Full Base64 export/import of character and world data.

### Planned Features (In Development 🚧)

#### 👥 Social Systems
- **Guild implementation**: Cooperative progression and shared treasuries.
- **NPC Interactions**: Advanced dialogue trees and relationship building.

#### 🌳 Generational Gameplay
- **Family Trees**: Lineage tracking and trait inheritance across generations.
- **Marriage**: Social bonds between characters.

#### 🏆 Advanced Progression
- **Specializations**: Higher-tier class advancements (e.g., Paladin, Necromancer).
- **Achievements**: Global challenge tracking with unique rewards.

## 🏗️ Project Structure

```
src/
├── components/          # UI View Layer
│   ├── CombatSystem.tsx   # Battle resolution view
│   ├── DungeonMap.tsx     # Exploration engine & grid
│   ├── CharacterCreation.ts# Initial state generator
│   └── ...
├── context/            # Global State Provider
│   └── GameContext.tsx    # State & Dispatch access
├── hooks/              # Engine Core Logic
│   ├── useGameTimer.ts    # The game loop (ticks/timing)
│   ├── useSaveSystem.ts   # Persistence manager
│   └── ...
├── reducers/           # State Transition Logic
│   └── gameReducer.ts     # Pure functions for state updates
├── types/              # Domain Models
│   └── game.ts            # Interfaces for Character, Item, etc.
└── utils/              # Helper utilities
    └── gameInitializer.ts # Default state & character generators
```

## 🛠️ Development & State Management

IdleRPG uses a predictable state container pattern:

```typescript
// Dispatch actions to trigger engine transitions
dispatch({ type: 'ADD_EXPERIENCE', payload: { characterId, amount } });

// Hook into the global engine state
const { state, activeCharacter } = useGame();
```

### Styling
The project uses **Tailwind CSS** with a custom theme:
- `.game-card`: Standardized panel styling.
- `.fantasy-gold`: Primary highlight color.
- `.rarity-*`: Scoped color tokens for item quality.

## 🚀 Roadmap

### Current Focus: Phase 2 (Advanced Features)
- [x] Automated Exploration Engine
- [x] Turn-based Battle Resolution
- [x] Basic Equipment & Inventory
- [/] **Dungeon Expansion** (Adding room variety and boss encounters)
- [ ] **Guild Foundations** (Base data structures and UI)

### Future Goals: Phase 3 (Social & Generational)
- [ ] NPC Dialogue System
- [ ] Family Tree Visualization
- [ ] World Events Loop
- [ ] Achievement Engine

## 🐛 Known Issues & Limitations
- **Skeletons**: `FamilyTree.tsx` and `GuildPanel.tsx` are current UI placeholders.
- **State Migration**: Breaking changes in `types/game.ts` may require clearing `localStorage`.
- **Combat Animations**: Battles are currently resolved through log updates; visual animations are planned.

---

**Happy Gaming! 🎮✨**
ter npm install)
- Placeholder components need full implementation
- Save system needs validation and error handling

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Happy Gaming! 🎮✨** 
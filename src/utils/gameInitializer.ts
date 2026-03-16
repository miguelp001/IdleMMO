import { GameState, Character, CharacterClass, CharacterStats, DungeonState, DungeonRoom, DungeonRoomType } from '../types/game';

export function generateDungeon(width = 7, height = 7): DungeonState {
  // Simple random dungeon with entrance at (0,0) and exit at (width-1,height-1)
  const grid: DungeonRoom[][] = [];
  for (let y = 0; y < height; y++) {
    const row: DungeonRoom[] = [];
    for (let x = 0; x < width; x++) {
      let type: DungeonRoomType = 'empty';
      if (x === 0 && y === 0) type = 'entrance';
      else if (x === width - 1 && y === height - 1) type = 'exit';
      else if (Math.random() < 0.15) type = 'enemy';
      else if (Math.random() < 0.08) type = 'treasure';
      else if (Math.random() < 0.03) type = 'event';
      row.push({ x, y, type, discovered: x === 0 && y === 0, visited: x === 0 && y === 0 });
    }
    grid.push(row);
  }
  return {
    grid,
    width,
    height,
    playerPosition: { x: 0, y: 0 },
    completed: false,
  };
}

export const generateInitialGameState = (): GameState => {
  return {
    version: '1.0.0',
    timestamp: new Date(),
    characters: [],
    activeCharacterId: undefined,
    worldState: {
      currentTime: new Date(),
      day: 1,
      season: 'spring',
      weather: 'clear',
      activeEvents: [],
      globalEffects: [],
      economy: {
        inflation: 1.0,
        itemPrices: {},
        marketTrends: {},
      },
      factionStandings: {
        'Trade_Consortium': 0,
        'Warrior_Keep': 0,
        'Explorer_League': 0
      },
      globalGoldMultiplier: 1.0,
    },
    achievements: [],
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      autoSave: true,
      autoSaveInterval: 30,
      notifications: true,
      theme: 'dark',
      language: 'en',
      quality: 'medium',
    },
    familyTrees: [],
    guilds: [],
    npcs: [],
    locations: [],
    events: [],
    combatState: {
      isInCombat: false,
      turn: 0,
      actions: [],
      effects: [],
    },
    saveSlots: [],
    dungeon: generateDungeon(),
    blacksmithOrders: [],
  };
};

export const MATERIALS = {
  IRON_SCRAP: {
    id: 'mat_iron_scrap',
    name: 'Iron Scrap',
    description: 'Rusty bits of iron, useful for basic forging.',
    type: 'crafting_material' as const,
    rarity: 'common' as const,
    level: 1,
    value: 5,
    stackable: true,
    quantity: 1,
    icon: '🔩',
    effects: [],
    requirements: { level: 1 },
  },
  STEEL_INGOT: {
    id: 'mat_steel_ingot',
    name: 'Steel Ingot',
    description: 'Refined steel, required for quality gear.',
    type: 'crafting_material' as const,
    rarity: 'uncommon' as const,
    level: 10,
    value: 25,
    stackable: true,
    quantity: 1,
    icon: '🟦',
    effects: [],
    requirements: { level: 10 },
  },
  MYTHRIL_SHARD: {
    id: 'mat_mythril_shard',
    name: 'Mythril Shard',
    description: 'A glowing shard of mythril, pulses with magical energy.',
    type: 'crafting_material' as const,
    rarity: 'rare' as const,
    level: 25,
    value: 100,
    stackable: true,
    quantity: 1,
    icon: '✨',
    effects: [],
    requirements: { level: 25 },
  },
};

export const generateSampleCharacter = (name: string, characterClass: CharacterClass): Character => {
  const baseStats: CharacterStats = {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    attack: 10,
    defense: 5,
    agility: 8,
    intelligence: 6,
    luck: 5,
    charisma: 7,
  };

  // Adjust stats based on class
  const classStats: Record<CharacterClass, Partial<CharacterStats>> = {
    warrior: { health: 120, maxHealth: 120, attack: 15, defense: 8 },
    mage: { mana: 80, maxMana: 80, intelligence: 12, attack: 6 },
    rogue: { agility: 15, attack: 12, health: 90, maxHealth: 90 },
    cleric: { health: 110, maxHealth: 110, mana: 70, maxMana: 70, defense: 7 },
  };

  const finalStats = { ...baseStats, ...classStats[characterClass] };

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    class: characterClass,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    stats: finalStats,
    equipment: [],
    inventory: [],
    generation: 1,
    parentIds: [],
    children: [],
    lastActive: new Date(),
    createdAt: new Date(),
    isAlive: true,
    age: 18,
    maxAge: 80,
    gold: 100,
    achievements: [],
    skills: [],
    currentLocation: 'town_square',
    quests: [],
    reputation: {},
  };
}; 
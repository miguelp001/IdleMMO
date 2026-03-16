import { GameState, Character, Item, Equipment, Skill, Quest, Enemy, WorldEvent, Achievement, Guild, NPC, GameEvent, BlacksmithOrder } from '../types/game';
import { MATERIALS, generateDungeon } from '../utils/gameInitializer';

// Simple UUID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

export type GameAction =
  // Character actions
  | { type: 'CREATE_CHARACTER'; payload: Omit<Character, 'id' | 'createdAt' | 'lastActive'> }
  | { type: 'SELECT_CHARACTER'; payload: string }
  | { type: 'UPDATE_CHARACTER'; payload: Partial<Character> & { id: string } }
  | { type: 'DELETE_CHARACTER'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: { characterId: string; amount: number } }
  | { type: 'LEVEL_UP_CHARACTER'; payload: { characterId: string; newLevel: number } }
  | { type: 'ADD_GOLD'; payload: { characterId: string; amount: number } }
  | { type: 'SPEND_GOLD'; payload: { characterId: string; amount: number } }
  | { type: 'AGE_CHARACTER'; payload: { characterId: string; newAge: number } }
  | { type: 'KILL_CHARACTER'; payload: string }
  
  // Equipment and inventory actions
  | { type: 'ADD_ITEM'; payload: { characterId: string; item: Item } }
  | { type: 'REMOVE_ITEM'; payload: { characterId: string; itemId: string; quantity?: number } }
  | { type: 'EQUIP_ITEM'; payload: { characterId: string; itemId: string; slot: string } }
  | { type: 'UNEQUIP_ITEM'; payload: { characterId: string; slot: string } }
  | { type: 'ENHANCE_EQUIPMENT'; payload: { characterId: string; itemId: string; enhancement: number } }
  | { type: 'REPAIR_EQUIPMENT'; payload: { characterId: string; itemId: string } }
  | { type: 'SOCKET_ITEM'; payload: { characterId: string; equipmentId: string; socketId: string; gem: Item } }
  
  // Skill actions
  | { type: 'LEARN_SKILL'; payload: { characterId: string; skill: Skill } }
  | { type: 'UPGRADE_SKILL'; payload: { characterId: string; skillId: string; newLevel: number } }
  | { type: 'ADD_SKILL_EXPERIENCE'; payload: { characterId: string; skillId: string; amount: number } }
  
  // Quest actions
  | { type: 'START_QUEST'; payload: { characterId: string; quest: Quest } }
  | { type: 'UPDATE_QUEST_PROGRESS'; payload: { characterId: string; questId: string; objectiveId: string; progress: number } }
  | { type: 'COMPLETE_QUEST'; payload: { characterId: string; questId: string } }
  | { type: 'ABANDON_QUEST'; payload: { characterId: string; questId: string } }
  
  // Combat actions
  | { type: 'START_COMBAT'; payload: { characterId: string; enemy: Enemy } }
  | { type: 'END_COMBAT'; payload: { victory: boolean; rewards?: any } }
  | { type: 'PROCESS_COMBAT_TURN'; payload?: { playerAction?: { type: 'attack'; damage: number } } }
  | { type: 'USE_SKILL_IN_COMBAT'; payload: { characterId: string; skillId: string; target: string } }
  | { type: 'USE_ITEM_IN_COMBAT'; payload: { characterId: string; itemId: string; target: string } }
  
  // World and location actions
  | { type: 'CHANGE_LOCATION'; payload: { characterId: string; locationId: string } }
  | { type: 'ADD_WORLD_EVENT'; payload: WorldEvent }
  | { type: 'REMOVE_WORLD_EVENT'; payload: string }
  | { type: 'UPDATE_WORLD_STATE'; payload: Partial<GameState['worldState']> }
  
  // Social actions
  | { type: 'CREATE_GUILD'; payload: Guild }
  | { type: 'JOIN_GUILD'; payload: { characterId: string; guildId: string; rank: string } }
  | { type: 'LEAVE_GUILD'; payload: { characterId: string } }
  | { type: 'UPDATE_GUILD'; payload: Partial<Guild> & { id: string } }
  | { type: 'ADD_NPC'; payload: NPC }
  | { type: 'UPDATE_NPC_RELATIONSHIP'; payload: { npcId: string; characterId: string; change: number } }
  
  // Achievement actions
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { characterId: string; achievement: Achievement } }
  | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { characterId: string; achievementId: string; progress: number } }
  
  // Family and generational actions
  | { type: 'MARRY_CHARACTERS'; payload: { character1Id: string; character2Id: string } }
  | { type: 'BIRTH_CHILD'; payload: { parent1Id: string; parent2Id: string; child: Character } }
  | { type: 'UPDATE_FAMILY_TREE'; payload: { familyTreeId: string; updates: any } }
  
  // Settings actions
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameState['settings']> }
  
  // Game state actions
  | { type: 'PROCESS_IDLE_PROGRESSION' }
  | { type: 'PROCESS_WORLD_EVENTS' }
  | { type: 'LOAD_GAME_STATE'; payload: GameState }
  | { type: 'RESET_GAME_STATE' }
  | { type: 'ADD_SAVE_SLOT'; payload: any }
  | { type: 'REMOVE_SAVE_SLOT'; payload: string }
  
  // Dungeon actions
  | { type: 'DUNGEON_MOVE'; payload: { dx: number; dy: number } }
  | { type: 'DUNGEON_DISCOVER'; payload: { x: number; y: number } }
  | { type: 'DUNGEON_ENCOUNTER'; payload: { x: number; y: number } }
  | { type: 'DUNGEON_RESET' }
  
  // Blacksmith actions
  | { type: 'START_BLACKSMITH_ORDER'; payload: BlacksmithOrder }
  | { type: 'CANCEL_BLACKSMITH_ORDER'; payload: string }
  | { type: 'CLAIM_BLACKSMITH_ORDER'; payload: string }
  | { type: 'ADVANCE_WORLD_STATE' }
  | { type: 'TICK_BLACKSMITH_ORDERS'; payload: number };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CREATE_CHARACTER': {
      const newCharacter: Character = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date(),
        lastActive: new Date(),
      };
      
      return {
        ...state,
        characters: [...state.characters, newCharacter],
        activeCharacterId: newCharacter.id,
      };
    }

    case 'SELECT_CHARACTER': {
      return {
        ...state,
        activeCharacterId: action.payload,
      };
    }

    case 'UPDATE_CHARACTER': {
      const { id, ...updates } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char =>
          char.id === id ? { ...char, ...updates, lastActive: new Date() } : char
        ),
      };
    }

    case 'DELETE_CHARACTER': {
      return {
        ...state,
        characters: state.characters.filter(char => char.id !== action.payload),
        activeCharacterId: state.activeCharacterId === action.payload ? undefined : state.activeCharacterId,
      };
    }

    case 'ADD_EXPERIENCE': {
      const { characterId, amount } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            const newExperience = char.experience + amount;
            const newLevel = Math.floor(newExperience / 100) + 1;
            const experienceToNext = newLevel * 100 - newExperience;
            
            // Check for level up
            if (newLevel > char.level) {
              // Dispatch level up event
              window.dispatchEvent(new CustomEvent('gameEvent', {
                detail: {
                  id: generateId(),
                  type: 'LEVEL_UP',
                  data: { character: char, newLevel },
                  timestamp: new Date(),
                } as GameEvent,
              }));
            }
            
            return {
              ...char,
              experience: newExperience,
              level: newLevel,
              experienceToNext,
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    case 'LEVEL_UP_CHARACTER': {
      const { characterId, newLevel } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            // Increase stats on level up
            const statIncrease = 5;
            const newStats = {
              ...char.stats,
              maxHealth: char.stats.maxHealth + statIncrease,
              health: char.stats.maxHealth + statIncrease, // Full heal on level up
              maxMana: char.stats.maxMana + statIncrease,
              mana: char.stats.maxMana + statIncrease,
              attack: char.stats.attack + statIncrease,
              defense: char.stats.defense + statIncrease,
              agility: char.stats.agility + statIncrease,
              intelligence: char.stats.intelligence + statIncrease,
            };
            
            return {
              ...char,
              level: newLevel,
              stats: newStats,
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    case 'ADD_GOLD': {
      const { characterId, amount } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            return {
              ...char,
              gold: char.gold + amount,
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    case 'SPEND_GOLD': {
      const { characterId, amount } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            return {
              ...char,
              gold: Math.max(0, char.gold - amount),
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    case 'ADD_ITEM': {
      const { characterId, item } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            const existingItem = char.inventory.find(invItem => invItem.id === item.id);
            if (existingItem && item.stackable) {
              return {
                ...char,
                inventory: char.inventory.map(invItem =>
                  invItem.id === item.id
                    ? { ...invItem, quantity: invItem.quantity + item.quantity }
                    : invItem
                ),
                lastActive: new Date(),
              };
            } else {
              return {
                ...char,
                inventory: [...char.inventory, item],
                lastActive: new Date(),
              };
            }
          }
          return char;
        }),
      };
    }

    case 'REMOVE_ITEM': {
      const { characterId, itemId, quantity = 1 } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            return {
              ...char,
              inventory: char.inventory
                .map(item => {
                  if (item.id === itemId) {
                    const newQuantity = item.quantity - quantity;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                  }
                  return item;
                })
                .filter(Boolean) as Item[],
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    case 'EQUIP_ITEM': {
      const { characterId, itemId, slot } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            const item = char.inventory.find(invItem => invItem.id === itemId);
            if (item && 'slot' in item) {
              const equipment = item as Equipment;
              // Unequip existing item in slot
              const unequippedItem = char.equipment.find(eq => eq.slot === slot);
              const newInventory = unequippedItem
                ? [...char.inventory, unequippedItem]
                : char.inventory;
              
              return {
                ...char,
                equipment: [...char.equipment.filter(eq => eq.slot !== slot), equipment],
                inventory: newInventory.filter(invItem => invItem.id !== itemId),
                lastActive: new Date(),
              };
            }
          }
          return char;
        }),
      };
    }

    case 'UNEQUIP_ITEM': {
      const { characterId, slot } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            const unequippedItem = char.equipment.find(eq => eq.slot === slot);
            if (unequippedItem) {
              return {
                ...char,
                equipment: char.equipment.filter(eq => eq.slot !== slot),
                inventory: [...char.inventory, unequippedItem],
                lastActive: new Date(),
              };
            }
          }
          return char;
        }),
      };
    }

    case 'START_COMBAT': {
      const { enemy } = action.payload;
      return {
        ...state,
        combatState: {
          isInCombat: true,
          currentEnemy: enemy,
          turn: 1,
          actions: [],
          effects: [],
        },
      };
    }

    case 'END_COMBAT': {
      return {
        ...state,
        combatState: {
          isInCombat: false,
          turn: 0,
          actions: [],
          effects: [],
        },
      };
    }

    case 'PROCESS_COMBAT_TURN': {
      // Only process if in combat
      if (!state.combatState.isInCombat || !state.activeCharacterId || !state.combatState.currentEnemy) {
        return state;
      }
      const player = state.characters.find(c => c.id === state.activeCharacterId);
      const enemy = state.combatState.currentEnemy;
      if (!player || !enemy) return state;
      let newPlayerHealth = player.stats.health;
      let newEnemyHealth = enemy.stats.health;
      let playerDefeated = false;
      let enemyDefeated = false;
      // Player action
      if (action.payload && action.payload.playerAction?.type === 'attack') {
        newEnemyHealth = Math.max(0, newEnemyHealth - action.payload.playerAction.damage);
        if (newEnemyHealth === 0) enemyDefeated = true;
      }
      // Enemy AI (simple attack if alive)
      if (!enemyDefeated) {
        const enemyDmg = Math.max(1, enemy.stats.attack - player.stats.defense);
        newPlayerHealth = Math.max(0, newPlayerHealth - enemyDmg);
        if (newPlayerHealth === 0) playerDefeated = true;
      }
      // Update state
      const newState = {
        ...state,
        characters: state.characters.map(c =>
          c.id === player.id ? {
            ...c,
            stats: { ...c.stats, health: newPlayerHealth },
            lastActive: new Date(),
          } : c
        ),
        combatState: {
          ...state.combatState,
          currentEnemy: {
            ...enemy,
            stats: { ...enemy.stats, health: newEnemyHealth },
          },
          turn: state.combatState.turn + 1,
          isInCombat: !playerDefeated && !enemyDefeated,
        },
      };

      // Handle material drops and rewards on enemy defeat
      if (enemyDefeated && state.activeCharacterId) {
        const { getGlobalModifiers, getFactionModifiers } = require('../services/worldEventService');
        const globalMods = getGlobalModifiers(state.worldState.activeEvents);
        const factionMods = getFactionModifiers(state.worldState.factionStandings);

        const xpReward = Math.round(enemy.experience * globalMods.xpGain * factionMods.xpGain);
        const goldReward = Math.round(enemy.gold * globalMods.goldGain * factionMods.goldGain);

        const drops: Item[] = [];
        const roll = Math.random();
        
        if (enemy.level >= 25 && roll < 0.2) {
          drops.push({ ...MATERIALS.MYTHRIL_SHARD, id: generateId() });
        } else if (enemy.level >= 10 && roll < 0.3) {
          drops.push({ ...MATERIALS.STEEL_INGOT, id: generateId() });
        } else if (roll < 0.4) {
          drops.push({ ...MATERIALS.IRON_SCRAP, id: generateId() });
        }

        const charIndex = newState.characters.findIndex(c => c.id === state.activeCharacterId);
        if (charIndex !== -1) {
          const char = { ...newState.characters[charIndex] };
          char.gold += goldReward;
          char.experience += xpReward;
          
          // XP/Leveling logic
          char.experienceToNext = (char.level * 100) - char.experience;
          if (char.experienceToNext <= 0) {
              char.level += 1;
              char.experienceToNext = (char.level * 100);
          }

          if (drops.length > 0) {
            drops.forEach(item => {
              const existingItem = char.inventory.find(invItem => invItem.name === item.name && invItem.stackable);
              if (existingItem) {
                existingItem.quantity += 1;
              } else {
                char.inventory.push(item);
              }
            });
          }
          newState.characters[charIndex] = char;
        }
      }

      return newState;
    }

    case 'PROCESS_IDLE_PROGRESSION': {
      if (!state.activeCharacterId) return state;
      
      const character = state.characters.find(char => char.id === state.activeCharacterId);
      if (!character) return state;
      
      // Simple idle progression - gain small amounts of XP and gold
      const idleXP = Math.floor(character.level * 0.1);
      const idleGold = Math.floor(character.level * 0.05);
      
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === state.activeCharacterId) {
            return {
              ...char,
              experience: char.experience + idleXP,
              gold: char.gold + idleGold,
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    case 'ADVANCE_WORLD_STATE': {
      const { updateActiveEvents, rollForNewEvent } = require('../services/worldEventService');
      
      let nextEvents = updateActiveEvents(state.worldState.activeEvents);
      const newEvent = rollForNewEvent(state.worldState.day);
      if (newEvent) nextEvents.push(newEvent);

      // Simple world charity: redistributing excess gold if global multiplier is high
      let nextGoldMultiplier = state.worldState.globalGoldMultiplier;
      if (nextGoldMultiplier > 1.5) {
          nextGoldMultiplier *= 0.95; // Decay
      }

      return {
          ...state,
          worldState: {
              ...state.worldState,
              activeEvents: nextEvents,
              day: state.worldState.day + 1,
              globalGoldMultiplier: nextGoldMultiplier
          }
      };
    }

    case 'PROCESS_WORLD_EVENTS': {
      // Periodic check for world event triggers
      // In this architecture, it might be called every tick or periodically
      return state;
    }

    case 'COMPLETE_QUEST': {
      const { characterId, questId } = action.payload;
      return {
        ...state,
        characters: state.characters.map(char => {
          if (char.id === characterId) {
            const quest = char.quests.find(q => q.id === questId);
            if (quest) {
              // Add reputation based on quest rewards or defaults
              const repGain = 10;
              const nextReputation = { ...char.reputation };
              
              // For now, simple logic: if it's a social quest, give general rep
              const factionId = (quest as any).factionId || 'General';
              nextReputation[factionId] = (nextReputation[factionId] || 0) + repGain;

              return {
                ...char,
                quests: char.quests.map(q => q.id === questId ? { ...q, isCompleted: true, isActive: false } : q),
                reputation: nextReputation,
                lastActive: new Date(),
              };
            }
          }
          return char;
        }),
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    }

    case 'LOAD_GAME_STATE': {
      return action.payload;
    }

    case 'RESET_GAME_STATE': {
      // Reset to initial state
      return {
        ...state,
        characters: [],
        activeCharacterId: undefined,
        combatState: {
          isInCombat: false,
          turn: 0,
          actions: [],
          effects: [],
        },
      };
    }

    case 'DUNGEON_MOVE': {
      if (!state.dungeon) return state;
      const { dx, dy } = action.payload;
      const { x, y } = state.dungeon.playerPosition;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= state.dungeon.width || ny >= state.dungeon.height) return state;
      const grid = state.dungeon.grid.map(row => row.map(cell => ({ ...cell })));
      grid[ny][nx].discovered = true;
      grid[ny][nx].visited = true;
      return {
        ...state,
        dungeon: {
          ...state.dungeon,
          playerPosition: { x: nx, y: ny },
          grid,
        },
      };
    }

    case 'DUNGEON_DISCOVER': {
      if (!state.dungeon) return state;
      const { x, y } = action.payload;
      const grid = state.dungeon.grid.map(row => row.map(cell => ({ ...cell })));
      grid[y][x].discovered = true;
      return {
        ...state,
        dungeon: {
          ...state.dungeon,
          grid,
        },
      };
    }

    case 'DUNGEON_ENCOUNTER': {
      // Placeholder: could trigger combat, loot, or event
      return state;
    }

    case 'DUNGEON_RESET': {
      // Regenerate dungeon
      return {
        ...state,
        dungeon: generateDungeon(),
      };
    }

    case 'START_BLACKSMITH_ORDER': {
      const order = action.payload;
      return {
        ...state,
        blacksmithOrders: [...state.blacksmithOrders, order],
        characters: state.characters.map(char => {
          if (char.id === order.characterId) {
            // Deduct materials
            let newInventory = [...char.inventory];
            order.materials.forEach((matReq: { itemId: string; quantity: number }) => {
              const itemIndex = newInventory.findIndex(i => i.id === matReq.itemId || i.name === matReq.itemId);
              if (itemIndex !== -1) {
                const item = newInventory[itemIndex];
                if (item.quantity > matReq.quantity) {
                  newInventory[itemIndex] = { ...item, quantity: item.quantity - matReq.quantity };
                } else {
                  newInventory.splice(itemIndex, 1);
                }
              }
            });
            return {
              ...char,
              gold: char.gold - order.cost,
              inventory: newInventory,
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    case 'CANCEL_BLACKSMITH_ORDER': {
      return {
        ...state,
        blacksmithOrders: state.blacksmithOrders.filter(o => o.id !== action.payload),
      };
    }

    case 'TICK_BLACKSMITH_ORDERS': {
      const ms = action.payload;
      return {
        ...state,
        blacksmithOrders: state.blacksmithOrders.map(order => {
          if (order.status === 'active') {
            const newRemaining = Math.max(0, order.remainingTime - ms);
            return {
              ...order,
              remainingTime: newRemaining,
              status: newRemaining === 0 ? 'completed' : 'active',
            };
          }
          return order;
        }),
      };
    }

    case 'CLAIM_BLACKSMITH_ORDER': {
      const orderId = action.payload;
      const order = state.blacksmithOrders.find(o => o.id === orderId);
      if (!order || order.status !== 'completed') return state;

      // Generate the item meeting the criteria
      // For now, a simplified generation
      const newItem: Equipment = {
        id: generateId(),
        name: `Masterwork ${order.itemType.charAt(0).toUpperCase() + order.itemType.slice(1)}`,
        description: `A custom-forged piece of equipment, made to your specific requirements.`,
        type: (order.itemType === 'weapon' ? 'weapon' : 'armor') as any,
        rarity: order.minRarity,
        level: 1, // Should scale with player level
        value: order.cost * 2,
        stackable: false,
        quantity: 1,
        icon: order.itemType === 'weapon' ? '⚔️' : '🛡️',
        effects: [],
        requirements: { level: 1 },
        slot: order.itemType,
        stats: order.minStat ? { [order.minStat.type]: order.minStat.value + Math.floor(Math.random() * 5) } : { attack: 10 },
        durability: 100,
        maxDurability: 100,
        enhancement: 0,
        sockets: [],
        enchantments: [],
      };

      return {
        ...state,
        blacksmithOrders: state.blacksmithOrders.filter(o => o.id !== orderId),
        characters: state.characters.map(char => {
          if (char.id === order.characterId) {
            return {
              ...char,
              inventory: [...char.inventory, newItem],
              lastActive: new Date(),
            };
          }
          return char;
        }),
      };
    }

    default:
      return state;
  }
}; 
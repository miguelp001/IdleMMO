// Character Types
export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'cleric';
export type CharacterSpecialization = 'berserker' | 'paladin' | 'wizard' | 'necromancer' | 'assassin' | 'ranger' | 'priest' | 'druid';
export type AscendedClass = 'dragon knight' | 'archmage' | 'shadow lord' | 'divine champion';

export interface CharacterStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  agility: number;
  intelligence: number;
  luck: number;
  charisma: number;
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  experienceToNext: number;
  stats: CharacterStats;
  specialization?: CharacterSpecialization;
  ascendedClass?: AscendedClass;
  equipment: Equipment[];
  inventory: Item[];
  generation: number;
  parentIds: string[];
  spouseId?: string;
  children: string[];
  lastActive: Date;
  createdAt: Date;
  isAlive: boolean;
  age: number;
  maxAge: number;
  gold: number;
  achievements: string[];
  skills: Skill[];
  currentLocation: string;
  quests: Quest[];
  guildId?: string;
  reputation: Record<string, number>;
}

// Item and Equipment Types
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'quest' | 'crafting_material';
export type EquipmentSlot = 'weapon' | 'shield' | 'helmet' | 'chest' | 'gloves' | 'boots' | 'ring' | 'necklace' | 'cloak';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  level: number;
  value: number;
  stackable: boolean;
  quantity: number;
  icon: string;
  effects: ItemEffect[];
  requirements: ItemRequirements;
  set?: string;
}

export interface Equipment extends Item {
  slot: EquipmentSlot;
  stats: Partial<CharacterStats>;
  durability: number;
  maxDurability: number;
  enhancement: number;
  sockets: Socket[];
  enchantments: Enchantment[];
}

export interface ItemEffect {
  type: 'stat' | 'skill' | 'passive' | 'active';
  target: keyof CharacterStats | string;
  value: number;
  duration?: number;
}

export interface ItemRequirements {
  level: number;
  class?: CharacterClass[];
  stats?: Partial<CharacterStats>;
}

export interface Socket {
  id: string;
  type: 'gem' | 'rune' | 'crystal';
  item?: Item;
}

export interface Enchantment {
  id: string;
  name: string;
  effect: ItemEffect;
  level: number;
}

// Skill System
export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive' | 'ultimate';
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;
  cooldown: number;
  manaCost: number;
  effects: SkillEffect[];
  requirements: SkillRequirements;
  icon: string;
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'utility';
  target: 'self' | 'enemy' | 'ally' | 'all';
  value: number;
  duration?: number;
  scaling: 'attack' | 'intelligence' | 'level' | 'fixed';
}

export interface SkillRequirements {
  level: number;
  class?: CharacterClass[];
  skills?: string[];
  stats?: Partial<CharacterStats>;
}

// Quest System
export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'kill' | 'collect' | 'explore' | 'craft' | 'social';
  objectives: QuestObjective[];
  rewards: QuestReward[];
  level: number;
  isCompleted: boolean;
  isActive: boolean;
  progress: Record<string, number>;
  timeLimit?: number;
  prerequisites: string[];
}

export interface QuestObjective {
  id: string;
  type: 'kill' | 'collect' | 'reach' | 'talk';
  target: string;
  required: number;
  current: number;
  description: string;
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item' | 'skill' | 'reputation';
  value: number | string;
  quantity?: number;
}

// Combat System
export interface CombatState {
  isInCombat: boolean;
  currentEnemy?: Enemy;
  turn: number;
  actions: CombatAction[];
  effects: CombatEffect[];
  rewards?: CombatRewards;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  stats: CharacterStats;
  abilities: EnemyAbility[];
  loot: LootTable;
  experience: number;
  gold: number;
  type: 'normal' | 'elite' | 'boss' | 'raid';
}

export interface EnemyAbility {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  effects: SkillEffect[];
}

export interface CombatAction {
  id: string;
  type: 'attack' | 'skill' | 'item' | 'flee';
  source: string;
  target: string;
  damage?: number;
  effects: CombatEffect[];
  timestamp: number;
}

export interface CombatEffect {
  id: string;
  type: 'buff' | 'debuff' | 'dot' | 'hot';
  target: string;
  effect: ItemEffect;
  duration: number;
  remaining: number;
}

export interface CombatRewards {
  experience: number;
  gold: number;
  items: Item[];
  reputation?: Record<string, number>;
}

export interface LootTable {
  items: LootItem[];
  gold: { min: number; max: number };
  experience: number;
}

export interface LootItem {
  item: Item;
  chance: number;
  quantity: { min: number; max: number };
}

// World and Location System
export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'town' | 'dungeon' | 'wilderness' | 'raid';
  level: number;
  enemies: string[];
  npcs: string[];
  shops: string[];
  connections: string[];
  requirements: LocationRequirements;
  events: WorldEvent[];
}

export interface LocationRequirements {
  level: number;
  quests?: string[];
  reputation?: Record<string, number>;
  items?: string[];
}

export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  type: 'festival' | 'invasion' | 'discovery' | 'disaster';
  duration: number;
  startTime: Date;
  endTime: Date;
  effects: WorldEventEffect[];
  rewards: WorldEventReward[];
}

export interface WorldEventEffect {
  type: 'stat_boost' | 'drop_rate' | 'experience' | 'gold';
  target: 'all' | 'specific_class' | 'specific_location';
  value: number;
  duration: number;
}

export interface WorldEventReward {
  type: 'item' | 'experience' | 'gold' | 'reputation';
  value: number | string;
  quantity?: number;
}

// Social System
export interface NPC {
  id: string;
  name: string;
  type: 'merchant' | 'quest_giver' | 'trainer' | 'companion';
  location: string;
  dialogue: NPCDialogue[];
  services: NPCServices;
  relationship: number;
  quests: string[];
}

export interface NPCDialogue {
  id: string;
  text: string;
  conditions: DialogueCondition[];
  responses: DialogueResponse[];
}

export interface DialogueCondition {
  type: 'level' | 'quest' | 'reputation' | 'item';
  value: any;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface DialogueResponse {
  id: string;
  text: string;
  effects: DialogueEffect[];
}

export interface DialogueEffect {
  type: 'reputation' | 'quest' | 'item' | 'relationship';
  target: string;
  value: number;
}

export interface NPCServices {
  shop?: Shop;
  training?: TrainingService;
  crafting?: CraftingService;
}

export interface Shop {
  items: ShopItem[];
  refreshInterval: number;
  lastRefresh: Date;
}

export interface ShopItem {
  item: Item;
  price: number;
  quantity: number;
  maxQuantity: number;
}

export interface TrainingService {
  skills: string[];
  cost: number;
  requirements: SkillRequirements;
}

export interface CraftingService {
  recipes: Recipe[];
  cost: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  materials: RecipeMaterial[];
  result: Item;
  experience: number;
  level: number;
}

export interface RecipeMaterial {
  itemId: string;
  quantity: number;
}

// Guild System
export interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  members: GuildMember[];
  leader: string;
  officers: string[];
  treasury: number;
  achievements: string[];
  raids: GuildRaid[];
  permissions: GuildPermissions;
}

export interface GuildMember {
  characterId: string;
  rank: GuildRank;
  joinDate: Date;
  contribution: number;
  lastActive: Date;
}

export type GuildRank = 'leader' | 'officer' | 'member' | 'recruit';

export interface GuildRaid {
  id: string;
  name: string;
  difficulty: 'normal' | 'heroic' | 'mythic';
  status: 'active' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  participants: string[];
  progress: number;
  rewards: GuildRaidReward[];
}

export interface GuildRaidReward {
  type: 'item' | 'experience' | 'gold' | 'guild_experience';
  value: number | string;
  quantity?: number;
  distribution: 'equal' | 'contribution' | 'random';
}

export interface GuildPermissions {
  invite: GuildRank[];
  kick: GuildRank[];
  promote: GuildRank[];
  demote: GuildRank[];
  treasury: GuildRank[];
  raids: GuildRank[];
}

// Family and Generational System
export interface BlacksmithOrder {
  id: string;
  characterId: string;
  itemType: EquipmentSlot;
  minRarity: ItemRarity;
  minStat?: {
    type: keyof CharacterStats;
    value: number;
  };
  startTime: Date;
  duration: number; // in milliseconds
  remainingTime: number;
  cost: number;
  materials: { itemId: string; quantity: number }[];
  status: 'active' | 'completed' | 'claimed';
}

export interface FamilyTree {
  id: string;
  rootCharacterId: string;
  nodes: FamilyNode[];
  connections: FamilyConnection[];
  generations: number;
  totalMembers: number;
}

export interface FamilyNode {
  id: string;
  characterId: string;
  generation: number;
  position: { x: number; y: number };
  parents: string[];
  children: string[];
  spouse?: string;
}

export interface FamilyConnection {
  id: string;
  from: string;
  to: string;
  type: 'parent' | 'spouse';
}

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  points: number;
  isCompleted: boolean;
  completedAt?: Date;
  progress: number;
  maxProgress: number;
  rewards: AchievementReward[];
  icon: string;
}

export type AchievementCategory = 'combat' | 'exploration' | 'social' | 'collection' | 'progression' | 'special';

export interface AchievementReward {
  type: 'title' | 'item' | 'experience' | 'gold' | 'skill';
  value: string | number;
  quantity?: number;
}

// Game Settings and State
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  notifications: boolean;
  theme: 'dark' | 'light';
  language: string;
  quality: 'low' | 'medium' | 'high';
}

export interface GameState {
  version: string;
  timestamp: Date;
  characters: Character[];
  activeCharacterId?: string;
  worldState: WorldState;
  achievements: Achievement[];
  settings: GameSettings;
  familyTrees: FamilyTree[];
  guilds: Guild[];
  npcs: NPC[];
  locations: Location[];
  events: WorldEvent[];
  combatState: CombatState;
  saveSlots: SaveSlot[];
  dungeon?: DungeonState;
  blacksmithOrders: BlacksmithOrder[];
}

export interface WorldState {
  currentTime: Date;
  day: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  weather: 'clear' | 'rain' | 'storm' | 'snow';
  activeEvents: string[];
  globalEffects: WorldEventEffect[];
  economy: EconomyState;
}

export interface EconomyState {
  inflation: number;
  itemPrices: Record<string, number>;
  marketTrends: Record<string, 'rising' | 'falling' | 'stable'>;
}

export interface SaveSlot {
  id: string;
  name: string;
  characterId: string;
  timestamp: Date;
  preview: SavePreview;
}

export interface SavePreview {
  characterName: string;
  characterClass: CharacterClass;
  level: number;
  location: string;
  playTime: number;
  achievements: number;
}

// Utility Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
}

export interface GameEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
}

export interface GameTimer {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  callback: () => void;
  isActive: boolean;
  isRepeating: boolean;
}

export type DungeonRoomType = 'empty' | 'enemy' | 'treasure' | 'boss' | 'entrance' | 'exit' | 'event';

export interface DungeonRoom {
  x: number;
  y: number;
  type: DungeonRoomType;
  discovered: boolean;
  visited: boolean;
  enemyId?: string;
  lootId?: string;
}

export interface DungeonState {
  grid: DungeonRoom[][];
  width: number;
  height: number;
  playerPosition: { x: number; y: number };
  completed: boolean;
} 
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, Character, Notification, GameEvent, GameTimer } from '../types/game';
import { gameReducer, GameAction } from '../reducers/gameReducer';
import { useGameTimer } from '../hooks/useGameTimer';
import { useSaveSystem } from '../hooks/useSaveSystem';
import { useNotificationSystem } from '../hooks/useNotificationSystem';
import { generateInitialGameState } from '../utils/gameInitializer';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  activeCharacter: Character | null;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  addTimer: (timer: Omit<GameTimer, 'id'>) => string;
  removeTimer: (id: string) => void;
  saveGame: () => Promise<void>;
  loadGame: (saveData?: string) => Promise<void>;
  exportSave: () => string;
  importSave: (saveString: string) => Promise<boolean>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, generateInitialGameState());
  
  const { addTimer, removeTimer, updateTimers } = useGameTimer();
  const { saveGame, loadGame, exportSave, importSave } = useSaveSystem(state, dispatch);
  const { notifications, addNotification, removeNotification } = useNotificationSystem();

  // Get active character
  const activeCharacter = state.activeCharacterId 
    ? state.characters.find(char => char.id === state.activeCharacterId) || null
    : null;

  // Auto-save effect
  useEffect(() => {
    if (state.settings.autoSave && state.activeCharacterId) {
      const interval = setInterval(() => {
        saveGame();
      }, state.settings.autoSaveInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [state.settings.autoSave, state.settings.autoSaveInterval, state.activeCharacterId, saveGame]);

  // Idle progression timer
  useEffect(() => {
    if (activeCharacter && !state.combatState.isInCombat) {
      const idleTimer = addTimer({
        name: 'idle_progression',
        duration: 1000, // 1 second
        remaining: 1000,
        callback: () => {
          dispatch({ type: 'PROCESS_IDLE_PROGRESSION' });
        },
        isActive: true,
        isRepeating: true,
      });

      return () => removeTimer(idleTimer);
    }
  }, [activeCharacter, state.combatState.isInCombat, addTimer, removeTimer]);

  // Combat timer
  useEffect(() => {
    if (state.combatState.isInCombat) {
      const combatTimer = addTimer({
        name: 'combat_turn',
        duration: 2000, // 2 seconds per turn
        remaining: 2000,
        callback: () => {
          dispatch({ type: 'PROCESS_COMBAT_TURN' });
        },
        isActive: true,
        isRepeating: true,
      });

      return () => removeTimer(combatTimer);
    }
  }, [state.combatState.isInCombat, addTimer, removeTimer]);

  // World events timer
  useEffect(() => {
    const worldTimer = addTimer({
      name: 'world_events',
      duration: 30000, // 30 seconds
      remaining: 30000,
      callback: () => {
        dispatch({ type: 'PROCESS_WORLD_EVENTS' });
      },
      isActive: true,
      isRepeating: true,
    });

    return () => removeTimer(worldTimer);
  }, [addTimer, removeTimer]);

  // Update timers
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimers();
      dispatch({ type: 'TICK_BLACKSMITH_ORDERS', payload: 100 });
    }, 100);

    return () => clearInterval(interval);
  }, [updateTimers]);

  // Handle game events
  useEffect(() => {
    const handleGameEvent = (event: GameEvent) => {
      switch (event.type) {
        case 'LEVEL_UP':
          addNotification({
            type: 'success',
            title: 'Level Up!',
            message: `${activeCharacter?.name} reached level ${activeCharacter?.level}!`,
            duration: 5000,
          });
          break;
        case 'ITEM_FOUND':
          addNotification({
            type: 'info',
            title: 'Item Found!',
            message: `Found ${event.data.item.name}!`,
            duration: 3000,
          });
          break;
        case 'QUEST_COMPLETED':
          addNotification({
            type: 'success',
            title: 'Quest Completed!',
            message: `Completed: ${event.data.quest.name}`,
            duration: 5000,
          });
          break;
        case 'ACHIEVEMENT_UNLOCKED':
          addNotification({
            type: 'success',
            title: 'Achievement Unlocked!',
            message: `Achievement: ${event.data.achievement.name}`,
            duration: 7000,
          });
          break;
        case 'COMBAT_VICTORY':
          addNotification({
            type: 'success',
            title: 'Victory!',
            message: `Defeated ${event.data.enemy.name}!`,
            duration: 4000,
          });
          break;
        case 'COMBAT_DEFEAT':
          addNotification({
            type: 'warning',
            title: 'Defeat',
            message: `Defeated by ${event.data.enemy.name}`,
            duration: 4000,
          });
          break;
        case 'GOLD_GAINED':
          addNotification({
            type: 'info',
            title: 'Gold Gained',
            message: `+${event.data.amount} gold`,
            duration: 2000,
          });
          break;
        case 'EXPERIENCE_GAINED':
          addNotification({
            type: 'info',
            title: 'Experience Gained',
            message: `+${event.data.amount} XP`,
            duration: 2000,
          });
          break;
        case 'SKILL_LEARNED':
          addNotification({
            type: 'success',
            title: 'Skill Learned!',
            message: `Learned: ${event.data.skill.name}`,
            duration: 4000,
          });
          break;
        case 'EQUIPMENT_ENHANCED':
          addNotification({
            type: 'success',
            title: 'Equipment Enhanced!',
            message: `${event.data.item.name} enhanced to +${event.data.enhancement}`,
            duration: 4000,
          });
          break;
        case 'MARRIAGE':
          addNotification({
            type: 'success',
            title: 'Marriage!',
            message: `${event.data.character1.name} and ${event.data.character2.name} are now married!`,
            duration: 6000,
          });
          break;
        case 'CHILD_BORN':
          addNotification({
            type: 'success',
            title: 'New Child!',
            message: `${event.data.child.name} was born to ${event.data.parents.join(' and ')}!`,
            duration: 6000,
          });
          break;
        case 'CHARACTER_DEATH':
          addNotification({
            type: 'error',
            title: 'Character Death',
            message: `${event.data.character.name} has passed away at age ${event.data.character.age}`,
            duration: 8000,
          });
          break;
        case 'GUILD_RAID_STARTED':
          addNotification({
            type: 'info',
            title: 'Guild Raid Started',
            message: `Raid: ${event.data.raid.name} has begun!`,
            duration: 5000,
          });
          break;
        case 'GUILD_RAID_COMPLETED':
          addNotification({
            type: 'success',
            title: 'Guild Raid Completed!',
            message: `Successfully completed: ${event.data.raid.name}`,
            duration: 6000,
          });
          break;
        case 'WORLD_EVENT_STARTED':
          addNotification({
            type: 'info',
            title: 'World Event',
            message: `${event.data.event.name} has begun!`,
            duration: 5000,
          });
          break;
        default:
          break;
      }
    };

    // Listen for game events
    const handleEvent = (event: CustomEvent<GameEvent>) => {
      handleGameEvent(event.detail);
    };

    window.addEventListener('gameEvent', handleEvent as EventListener);

    return () => {
      window.removeEventListener('gameEvent', handleEvent as EventListener);
    };
  }, [activeCharacter, addNotification]);

  // Load game on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const contextValue: GameContextType = {
    state,
    dispatch,
    activeCharacter,
    notifications,
    addNotification,
    removeNotification,
    addTimer,
    removeTimer,
    saveGame,
    loadGame,
    exportSave,
    importSave,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 
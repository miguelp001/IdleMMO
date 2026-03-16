import { useCallback } from 'react';
import { GameState } from '../types/game';
import { GameAction } from '../reducers/gameReducer';

const SAVE_KEY = 'idleRPG_save';
const SAVE_VERSION = '1.0.0';

export const useSaveSystem = (state: GameState, dispatch: React.Dispatch<GameAction>) => {
  const saveGame = useCallback(async (): Promise<void> => {
    try {
      const saveData = {
        ...state,
        version: SAVE_VERSION,
        timestamp: new Date(),
      };
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      console.log('Game saved successfully');
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }, [state]);

  const loadGame = useCallback(async (saveData?: string): Promise<void> => {
    try {
      let data: string;
      
      if (saveData) {
        data = saveData;
      } else {
        data = localStorage.getItem(SAVE_KEY) || '';
      }
      
      if (!data) {
        console.log('No save data found, starting new game');
        return;
      }
      
      const parsedData = JSON.parse(data) as GameState;
      
      // Validate save data version
      if (parsedData.version !== SAVE_VERSION) {
        console.warn('Save data version mismatch, attempting migration');
        // TODO: Implement save data migration
      }
      
      // Convert date strings back to Date objects
      const migratedData: GameState = {
        ...parsedData,
        timestamp: new Date(parsedData.timestamp),
        worldState: {
          ...parsedData.worldState,
          currentTime: new Date(parsedData.worldState.currentTime),
        },
        characters: parsedData.characters.map(char => ({
          ...char,
          lastActive: new Date(char.lastActive),
          createdAt: new Date(char.createdAt),
        })),
        saveSlots: parsedData.saveSlots.map(slot => ({
          ...slot,
          timestamp: new Date(slot.timestamp),
        })),
      };
      
      dispatch({ type: 'LOAD_GAME_STATE', payload: migratedData });
      console.log('Game loaded successfully');
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  }, [dispatch]);

  const exportSave = useCallback((): string => {
    try {
      const saveData = {
        ...state,
        version: SAVE_VERSION,
        timestamp: new Date(),
      };
      
      const jsonString = JSON.stringify(saveData);
      const base64String = btoa(jsonString);
      return base64String;
    } catch (error) {
      console.error('Failed to export save:', error);
      return '';
    }
  }, [state]);

  const importSave = useCallback(async (saveString: string): Promise<boolean> => {
    try {
      const jsonString = atob(saveString);
      const parsedData = JSON.parse(jsonString);
      
      if (!parsedData.version || !parsedData.characters) {
        throw new Error('Invalid save data format');
      }
      
      await loadGame(jsonString);
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }, [loadGame]);

  const createSaveSlot = useCallback((name: string, characterId: string) => {
    const character = state.characters.find(char => char.id === characterId);
    if (!character) return;
    
    const saveSlot = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      characterId,
      timestamp: new Date(),
      preview: {
        characterName: character.name,
        characterClass: character.class,
        level: character.level,
        location: character.currentLocation,
        playTime: Date.now() - character.createdAt.getTime(),
        achievements: character.achievements.length,
      },
    };
    
    dispatch({ type: 'ADD_SAVE_SLOT', payload: saveSlot });
  }, [state.characters, dispatch]);

  const deleteSaveSlot = useCallback((slotId: string) => {
    dispatch({ type: 'REMOVE_SAVE_SLOT', payload: slotId });
  }, [dispatch]);

  const autoSave = useCallback(async () => {
    if (state.settings.autoSave) {
      await saveGame();
    }
  }, [state.settings.autoSave, saveGame]);

  return {
    saveGame,
    loadGame,
    exportSave,
    importSave,
    createSaveSlot,
    deleteSaveSlot,
    autoSave,
  };
}; 
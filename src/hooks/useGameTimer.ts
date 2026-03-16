import { useState, useCallback } from 'react';
import { GameTimer } from '../types/game';

export const useGameTimer = () => {
  const [timers, setTimers] = useState<Map<string, GameTimer>>(new Map());

  const addTimer = useCallback((timer: Omit<GameTimer, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newTimer: GameTimer = {
      ...timer,
      id,
    };
    
    setTimers(prev => new Map(prev).set(id, newTimer));
    return id;
  }, []);

  const removeTimer = useCallback((id: string) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      newTimers.delete(id);
      return newTimers;
    });
  }, []);

  const updateTimers = useCallback(() => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timersToRemove: string[] = [];
      
      newTimers.forEach((timer, id) => {
        if (timer.isActive && timer.remaining > 0) {
          timer.remaining -= 100; // Update every 100ms
          
          if (timer.remaining <= 0) {
            timer.callback();
            
            if (timer.isRepeating) {
              timer.remaining = timer.duration;
            } else {
              timersToRemove.push(id);
            }
          }
        }
      });
      
      timersToRemove.forEach(id => newTimers.delete(id));
      return newTimers;
    });
  }, []);

  const pauseTimer = useCallback((id: string) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timer = newTimers.get(id);
      if (timer) {
        timer.isActive = false;
      }
      return newTimers;
    });
  }, []);

  const resumeTimer = useCallback((id: string) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timer = newTimers.get(id);
      if (timer) {
        timer.isActive = true;
      }
      return newTimers;
    });
  }, []);

  const resetTimer = useCallback((id: string) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timer = newTimers.get(id);
      if (timer) {
        timer.remaining = timer.duration;
      }
      return newTimers;
    });
  }, []);

  const getTimer = useCallback((id: string): GameTimer | undefined => {
    return timers.get(id);
  }, [timers]);

  const getAllTimers = useCallback((): GameTimer[] => {
    return Array.from(timers.values());
  }, [timers]);

  const clearAllTimers = useCallback(() => {
    setTimers(new Map());
  }, []);

  return {
    timers: Array.from(timers.values()),
    addTimer,
    removeTimer,
    updateTimers,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getTimer,
    getAllTimers,
    clearAllTimers,
  };
}; 
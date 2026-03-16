import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { DungeonRoom } from '../types/game';

export const DungeonMap: React.FC = () => {
  const { state, dispatch, activeCharacter } = useGame();
  const [isExploring, setIsExploring] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [pathIndex, setPathIndex] = useState(0);
  const dungeon = state.dungeon;
  if (!dungeon) return <div className="game-card">No dungeon found.</div>;
  const { grid, playerPosition } = dungeon;

  // Generate linear path from entrance to exit
  const generateLinearPath = () => {
    const path: { x: number; y: number }[] = [];
    const width = dungeon.width;
    const height = dungeon.height;
    
    // Start at entrance (0, 0)
    let currentX = 0;
    let currentY = 0;
    path.push({ x: currentX, y: currentY });
    
    // Create a path that moves towards the exit (width-1, height-1)
    while (currentX < width - 1 || currentY < height - 1) {
      // Prefer moving right or down towards the exit
      const canMoveRight = currentX < width - 1;
      const canMoveDown = currentY < height - 1;
      
      if (canMoveRight && (currentX < width - 2 || currentY >= height - 1)) {
        currentX++;
      } else if (canMoveDown) {
        currentY++;
      } else if (canMoveRight) {
        currentX++;
      }
      
      path.push({ x: currentX, y: currentY });
    }
    
    return path;
  };

  const [linearPath] = useState(generateLinearPath());

  // Auto-exploration timer - follow linear path
  useEffect(() => {
    if (!isExploring || !activeCharacter) return;
    
    const interval = setInterval(() => {
      if (pathIndex < linearPath.length - 1) {
        const nextPosition = linearPath[pathIndex + 1];
        const currentPos = linearPath[pathIndex];
        
        // Calculate direction to next position
        const dx = nextPosition.x - currentPos.x;
        const dy = nextPosition.y - currentPos.y;
        
        // Move to next position in path
        dispatch({ type: 'DUNGEON_MOVE', payload: { dx, dy } });
        setPathIndex(pathIndex + 1);
        
        // Check for encounters at the new position
        const targetRoom = grid[nextPosition.y][nextPosition.x];
        if (targetRoom.type === 'enemy' && !targetRoom.visited) {
          // Trigger automatic combat
          triggerCombat();
        } else if (targetRoom.type === 'treasure' && !targetRoom.visited) {
          // Give treasure
          const gold = Math.floor(Math.random() * 50) + 10;
          const exp = Math.floor(Math.random() * 20) + 5;
          dispatch({ type: 'ADD_GOLD', payload: { characterId: activeCharacter.id, amount: gold } });
          dispatch({ type: 'ADD_EXPERIENCE', payload: { characterId: activeCharacter.id, amount: exp } });
          setCombatLog(prev => [`Found treasure! +${gold} gold, +${exp} XP`, ...prev.slice(0, 4)]);
        } else if (targetRoom.type === 'exit') {
          // Reached the end
          setCombatLog(prev => [`Reached dungeon exit!`, ...prev.slice(0, 4)]);
          setIsExploring(false);
        }
      } else {
        // Reached the end of the path
        setIsExploring(false);
      }
    }, 2000); // Move every 2 seconds

    return () => clearInterval(interval);
  }, [isExploring, pathIndex, linearPath, grid, dispatch, activeCharacter]);

  const triggerCombat = () => {
    if (!activeCharacter) return;
    
    // Create a simple enemy based on character level
    const enemyLevel = Math.max(1, activeCharacter.level - 1 + Math.floor(Math.random() * 3));
    const enemy = {
      id: `enemy_${Date.now()}`,
      name: `Goblin Warrior`,
      level: enemyLevel,
      stats: {
        health: 20 + (enemyLevel * 10),
        maxHealth: 20 + (enemyLevel * 10),
        mana: 0,
        maxMana: 0,
        attack: 5 + (enemyLevel * 2),
        defense: 2 + enemyLevel,
        agility: 3 + enemyLevel,
        intelligence: 1,
        luck: 1,
        charisma: 1,
      },
      abilities: [],
      loot: { items: [], gold: { min: 5, max: 15 }, experience: 10 + (enemyLevel * 5) },
      experience: 10 + (enemyLevel * 5),
      gold: 5 + Math.floor(Math.random() * 10),
      type: 'normal' as const,
    };

    // Start combat
    dispatch({ type: 'START_COMBAT', payload: { characterId: activeCharacter.id, enemy } });
    
    // Auto-resolve combat after a delay
    setTimeout(() => {
      resolveCombat(enemy);
    }, 1000);
  };

  const resolveCombat = (enemy: any) => {
    if (!activeCharacter) return;
    
    // Simple combat resolution
    const playerDmg = Math.max(1, activeCharacter.stats.attack - enemy.stats.defense);
    const enemyDmg = Math.max(1, enemy.stats.attack - activeCharacter.stats.defense);
    
    // Calculate combat outcome
    const roundsToKillEnemy = Math.ceil(enemy.stats.health / playerDmg);
    const roundsToKillPlayer = Math.ceil(activeCharacter.stats.health / enemyDmg);
    
    if (roundsToKillEnemy <= roundsToKillPlayer) {
      // Victory
      const expGained = enemy.experience;
      const goldGained = enemy.gold;
      
      dispatch({ type: 'ADD_EXPERIENCE', payload: { characterId: activeCharacter.id, amount: expGained } });
      dispatch({ type: 'ADD_GOLD', payload: { characterId: activeCharacter.id, amount: goldGained } });
      dispatch({ type: 'END_COMBAT', payload: { victory: true, rewards: { experience: expGained, gold: goldGained } } });
      
      setCombatLog(prev => [
        `Victory! Defeated ${enemy.name} - +${expGained} XP, +${goldGained} gold`,
        ...prev.slice(0, 4)
      ]);
    } else {
      // Defeat
      dispatch({ type: 'END_COMBAT', payload: { victory: false } });
      setCombatLog(prev => [
        `Defeated by ${enemy.name}...`,
        ...prev.slice(0, 4)
      ]);
    }
  };

  const toggleExploration = () => {
    if (!isExploring) {
      setPathIndex(0);
      setCombatLog([]);
    }
    setIsExploring(!isExploring);
  };

  const resetDungeon = () => {
    setIsExploring(false);
    setPathIndex(0);
    setCombatLog([]);
    dispatch({ type: 'DUNGEON_RESET' });
  };

  // Calculate progress percentage
  const progressPercentage = linearPath.length > 1 ? (pathIndex / (linearPath.length - 1)) * 100 : 0;

  return (
    <div className="game-card flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-4">Dungeon Exploration</h2>
      <div className="mb-4 text-dark-300 text-center">
        <p>Follow the linear path from entrance to exit!</p>
        <p className="text-sm mt-1">Status: {isExploring ? 'Exploring...' : 'Idle'}</p>
        <p className="text-sm">Progress: {Math.round(progressPercentage)}%</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full mb-4 bg-dark-800 rounded-full h-2 border border-dark-600">
        <motion.div
          className="bg-green-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="grid grid-cols-7 gap-1 bg-dark-800 p-2 rounded-lg border border-dark-600 mb-4">
        {grid.map((row: DungeonRoom[], y: number) =>
          row.map((cell: DungeonRoom, x: number) => {
            const isPlayer = playerPosition.x === x && playerPosition.y === y;
            const isOnPath = linearPath.some(pos => pos.x === x && pos.y === y);
            const isPathAhead = linearPath.slice(pathIndex).some(pos => pos.x === x && pos.y === y);
            
            let bg = 'bg-dark-700';
            if (cell.discovered) {
              if (cell.type === 'entrance') bg = 'bg-green-700';
              else if (cell.type === 'exit') bg = 'bg-blue-700';
              else if (cell.type === 'enemy') bg = 'bg-red-700';
              else if (cell.type === 'treasure') bg = 'bg-yellow-600';
              else if (cell.type === 'event') bg = 'bg-purple-700';
              else if (isOnPath) bg = 'bg-dark-500';
              else bg = 'bg-dark-600';
            }
            
            return (
              <motion.div
                key={`${x},${y}`}
                className={`w-8 h-8 flex items-center justify-center rounded ${bg} border border-dark-900 relative`}
                animate={{ 
                  scale: isPlayer ? 1.2 : 1, 
                  opacity: cell.discovered ? 1 : 0.3,
                  rotate: isPlayer && isExploring ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300,
                  rotate: { duration: 0.5, repeat: isExploring ? Infinity : 0 }
                }}
              >
                {isPlayer && <span className="text-white font-bold">@</span>}
                {!isPlayer && cell.discovered && cell.type !== 'empty' && (
                  <span className="text-xs text-white">
                    {cell.type === 'entrance' ? 'S' :
                     cell.type === 'exit' ? 'E' :
                     cell.type === 'enemy' ? '!' :
                     cell.type === 'treasure' ? '$' :
                     cell.type === 'event' ? '?' : ''}
                  </span>
                )}
                {isPathAhead && !isPlayer && cell.discovered && cell.type === 'empty' && (
                  <span className="text-xs text-green-400">•</span>
                )}
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Combat Log */}
      {combatLog.length > 0 && (
        <div className="w-full mb-4 bg-dark-800 rounded-lg p-3 border border-dark-600 max-h-32 overflow-y-auto">
          <h3 className="text-white font-bold mb-2">Exploration Log</h3>
          {combatLog.map((entry, idx) => (
            <div key={idx} className="text-sm text-dark-200 mb-1">
              {entry}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <button 
          onClick={toggleExploration} 
          className={`btn ${isExploring ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isExploring ? 'Stop Exploring' : 'Start Exploring'}
        </button>
        <button onClick={resetDungeon} className="btn">Reset Dungeon</button>
      </div>
    </div>
  );
}; 
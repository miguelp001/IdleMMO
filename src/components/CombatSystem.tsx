import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

export const CombatSystem: React.FC = () => {
  const { state, dispatch, activeCharacter } = useGame();
  const { combatState } = state;
  const enemy = combatState.currentEnemy;
  const [log, setLog] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  // Auto-combat for idle gameplay
  useEffect(() => {
    if (!combatState.isInCombat || !enemy || !activeCharacter) return;

    const combatInterval = setInterval(() => {
      // Automatic combat resolution
      const playerDmg = Math.max(1, activeCharacter.stats.attack - enemy.stats.defense);
      const enemyDmg = Math.max(1, enemy.stats.attack - activeCharacter.stats.defense);
      
      // Update combat log
      setLog(prev => [
        `You attack ${enemy.name} for ${playerDmg} damage!`,
        `${enemy.name} attacks you for ${enemyDmg} damage!`,
        ...prev.slice(0, 6)
      ]);

      // Process turn
      dispatch({ type: 'PROCESS_COMBAT_TURN', payload: { playerAction: { type: 'attack', damage: playerDmg } } });
    }, 1500); // Combat turn every 1.5 seconds

    return () => clearInterval(combatInterval);
  }, [combatState.isInCombat, enemy, activeCharacter, dispatch]);

  if (!activeCharacter || !enemy) {
    return (
      <div className="game-card">
        <h2 className="text-2xl font-bold text-white mb-6">Combat System</h2>
        <div className="text-dark-300">
          {!activeCharacter ? 'No active character.' : 'No active combat encounter.'}
        </div>
      </div>
    );
  }

  // Helper for health bar width
  const getBarWidth = (current: number, max: number) => `${Math.max(0, (current / max) * 100)}%`;

  // Player action handlers (for manual combat if needed)
  const handleAttack = async () => {
    if (animating) return;
    setAnimating(true);
    const playerDmg = Math.max(1, activeCharacter.stats.attack - enemy.stats.defense);
    setLog(l => [
      `You attack ${enemy.name} for ${playerDmg} damage!`,
      ...l,
    ]);
    dispatch({ type: 'PROCESS_COMBAT_TURN', payload: { playerAction: { type: 'attack', damage: playerDmg } } });
    setTimeout(() => setAnimating(false), 800);
  };

  const handleFlee = () => {
    setLog(l => [
      `You attempt to flee...`,
      ...l,
    ]);
    dispatch({ type: 'END_COMBAT', payload: { victory: false } });
  };

  // Animate health changes
  const playerHealth = activeCharacter.stats.health;
  const playerMaxHealth = activeCharacter.stats.maxHealth;
  const enemyHealth = enemy.stats.health;
  const enemyMaxHealth = enemy.stats.maxHealth;

  // End of combat
  if (!combatState.isInCombat) {
    return (
      <div className="game-card">
        <h2 className="text-2xl font-bold text-white mb-6">Combat Results</h2>
        <div className="text-dark-300 mb-4">
          {playerHealth > 0 && enemyHealth <= 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-green-400 font-bold text-lg"
            >
              🎉 Victory! 🎉
            </motion.div>
          )}
          {playerHealth <= 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-red-400 font-bold text-lg"
            >
              💀 Defeat... 💀
            </motion.div>
          )}
          {playerHealth > 0 && enemyHealth > 0 && <span>Combat ended.</span>}
        </div>
        <button className="game-button" onClick={() => dispatch({ type: 'END_COMBAT', payload: { victory: playerHealth > 0 } })}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Combat Encounter</h2>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-red-400 font-bold"
        >
          ⚔️ FIGHTING ⚔️
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Player Panel */}
        <motion.div 
          className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          animate={{ 
            borderColor: playerHealth < playerMaxHealth * 0.3 ? '#ef4444' : '#4b5563',
            boxShadow: playerHealth < playerMaxHealth * 0.3 ? '0 0 10px #ef4444' : 'none'
          }}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🧑‍🎤</span>
            <span className="font-bold text-white">{activeCharacter.name}</span>
            <span className="ml-2 text-dark-300">Lv {activeCharacter.level}</span>
          </div>
          <div className="mb-2">
            <span className="text-dark-300">Health</span>
            <motion.div className="stat-bar bg-dark-800 mt-1" style={{ height: 12 }}>
              <motion.div
                className="stat-fill bg-fantasy-red"
                initial={{ width: getBarWidth(playerHealth, playerMaxHealth) }}
                animate={{ width: getBarWidth(playerHealth, playerMaxHealth) }}
                transition={{ duration: 0.5 }}
                style={{ height: 12 }}
              />
            </motion.div>
            <span className="text-xs text-white">{playerHealth} / {playerMaxHealth}</span>
          </div>
          <div>
            <span className="text-dark-300">Mana</span>
            <motion.div className="stat-bar bg-dark-800 mt-1" style={{ height: 12 }}>
              <motion.div
                className="stat-fill bg-fantasy-blue"
                initial={{ width: getBarWidth(activeCharacter.stats.mana, activeCharacter.stats.maxMana) }}
                animate={{ width: getBarWidth(activeCharacter.stats.mana, activeCharacter.stats.maxMana) }}
                transition={{ duration: 0.5 }}
                style={{ height: 12 }}
              />
            </motion.div>
            <span className="text-xs text-white">{activeCharacter.stats.mana} / {activeCharacter.stats.maxMana}</span>
          </div>
        </motion.div>
        
        {/* Enemy Panel */}
        <motion.div 
          className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          animate={{ 
            borderColor: enemyHealth < enemyMaxHealth * 0.3 ? '#ef4444' : '#4b5563',
            boxShadow: enemyHealth < enemyMaxHealth * 0.3 ? '0 0 10px #ef4444' : 'none'
          }}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">👹</span>
            <span className="font-bold text-white">{enemy.name}</span>
            <span className="ml-2 text-dark-300">Lv {enemy.level}</span>
          </div>
          <div className="mb-2">
            <span className="text-dark-300">Health</span>
            <motion.div className="stat-bar bg-dark-800 mt-1" style={{ height: 12 }}>
              <motion.div
                className="stat-fill bg-fantasy-red"
                initial={{ width: getBarWidth(enemyHealth, enemyMaxHealth) }}
                animate={{ width: getBarWidth(enemyHealth, enemyMaxHealth) }}
                transition={{ duration: 0.5 }}
                style={{ height: 12 }}
              />
            </motion.div>
            <span className="text-xs text-white">{enemyHealth} / {enemyMaxHealth}</span>
          </div>
        </motion.div>
      </div>
      
      {/* Auto-Combat Status */}
      <div className="bg-dark-800 rounded-lg p-3 mb-6 border border-dark-600">
        <div className="text-center text-dark-300 mb-2">
          <span className="text-green-400">🔄 Auto-Combat Active</span>
        </div>
        <div className="text-sm text-dark-300 text-center">
          Combat will resolve automatically every 1.5 seconds
        </div>
      </div>
      
      {/* Action Buttons (disabled during auto-combat) */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="game-button" onClick={handleAttack} disabled={animating}>Attack</button>
        <button className="game-button-secondary" disabled>Skill (soon)</button>
        <button className="game-button-secondary" disabled>Item (soon)</button>
        <button className="game-button-secondary" onClick={handleFlee} disabled={animating}>Flee</button>
      </div>
      
      {/* Combat Log */}
      <div className="bg-dark-800 rounded-lg p-3 border border-dark-600 max-h-40 overflow-y-auto text-sm text-dark-200">
        <AnimatePresence>
          {log.slice(0, 8).map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-1"
            >
              {entry}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}; 
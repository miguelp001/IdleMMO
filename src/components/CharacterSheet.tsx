import React from 'react';
import { useGame } from '../context/GameContext';

export const CharacterSheet: React.FC = () => {
  const { activeCharacter } = useGame();

  if (!activeCharacter) {
    return <div className="text-white">No character selected</div>;
  }

  return (
    <div className="game-card">
      <h2 className="text-2xl font-bold text-white mb-6">Character Sheet</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Basic Info</h3>
          <div className="space-y-2 text-dark-300">
            <div>Name: <span className="text-white">{activeCharacter.name}</span></div>
            <div>Class: <span className="text-white">{activeCharacter.class}</span></div>
            <div>Level: <span className="text-white">{activeCharacter.level}</span></div>
            <div>Age: <span className="text-white">{activeCharacter.age}</span></div>
            <div>Gold: <span className="text-fantasy-gold">{activeCharacter.gold}</span></div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
          <div className="space-y-2 text-dark-300">
            <div>Health: <span className="text-white">{activeCharacter.stats.health}/{activeCharacter.stats.maxHealth}</span></div>
            <div>Mana: <span className="text-white">{activeCharacter.stats.mana}/{activeCharacter.stats.maxMana}</span></div>
            <div>Attack: <span className="text-white">{activeCharacter.stats.attack}</span></div>
            <div>Defense: <span className="text-white">{activeCharacter.stats.defense}</span></div>
            <div>Agility: <span className="text-white">{activeCharacter.stats.agility}</span></div>
            <div>Intelligence: <span className="text-white">{activeCharacter.stats.intelligence}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
import React from 'react';
import { useGame } from '../context/GameContext';

export const InventoryGrid: React.FC = () => {
  const { activeCharacter } = useGame();

  if (!activeCharacter) {
    return <div className="text-white">No character selected</div>;
  }

  return (
    <div className="game-card">
      <h2 className="text-2xl font-bold text-white mb-6">Inventory</h2>
      <div className="grid grid-cols-6 gap-2">
        {activeCharacter.inventory.map((item, index) => (
          <div key={index} className="bg-dark-700 p-2 rounded border border-dark-600 text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs text-white truncate">{item.name}</div>
            {item.quantity > 1 && (
              <div className="text-xs text-fantasy-gold">{item.quantity}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 
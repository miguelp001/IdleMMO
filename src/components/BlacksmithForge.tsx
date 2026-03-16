import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { EquipmentSlot, ItemRarity, CharacterStats, BlacksmithOrder } from '../types/game';
import { MATERIALS } from '../utils/gameInitializer';

const equipmentSlots: EquipmentSlot[] = ['weapon', 'helmet', 'chest', 'gloves', 'boots', 'shield', 'ring', 'necklace', 'cloak'];
const rarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const statTypes: (keyof CharacterStats)[] = ['attack', 'defense', 'agility', 'intelligence', 'luck', 'charisma'];

export const BlacksmithForge: React.FC = () => {
  const { state, dispatch, activeCharacter } = useGame();
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot>('weapon');
  const [selectedRarity, setSelectedRarity] = useState<ItemRarity>('common');
  const [selectedStat, setSelectedStat] = useState<keyof CharacterStats | 'none'>('none');
  const [statValue, setStatValue] = useState(5);

  const calculateCost = () => {
    let base = 50;
    const rarityMultipliers: Record<ItemRarity, number> = {
      common: 1,
      uncommon: 2.5,
      rare: 5,
      epic: 15,
      legendary: 50,
    };
    let cost = base * rarityMultipliers[selectedRarity];
    if (selectedStat !== 'none') {
      cost *= 1.5;
      cost += statValue * 10;
    }
    return Math.floor(cost);
  };

  const calculateDuration = () => {
    let base = 60000; // 1 minute
    const rarityMultipliers: Record<ItemRarity, number> = {
      common: 1,
      uncommon: 3,
      rare: 10,
      epic: 30,
      legendary: 120,
    };
    let duration = base * rarityMultipliers[selectedRarity];
    if (selectedStat !== 'none') {
      duration *= 1.5;
    }
    return duration;
  };

  const getRequiredMaterials = () => {
    const materials = [];
    if (selectedRarity === 'legendary' || selectedRarity === 'epic') {
      materials.push({ itemId: MATERIALS.MYTHRIL_SHARD.id, name: MATERIALS.MYTHRIL_SHARD.name, quantity: selectedRarity === 'legendary' ? 3 : 1 });
    }
    if (selectedRarity === 'rare' || selectedRarity === 'epic') {
      materials.push({ itemId: MATERIALS.STEEL_INGOT.id, name: MATERIALS.STEEL_INGOT.name, quantity: 5 });
    }
    if (selectedRarity !== 'legendary') {
      materials.push({ itemId: MATERIALS.IRON_SCRAP.id, name: MATERIALS.IRON_SCRAP.name, quantity: 10 });
    }
    return materials;
  };

  const canAfford = () => {
    if (!activeCharacter) return false;
    const cost = calculateCost();
    if (activeCharacter.gold < cost) return false;

    const reqMats = getRequiredMaterials();
    for (const req of reqMats) {
      const invItem = activeCharacter.inventory.find(i => i.id === req.itemId || i.name === req.name);
      if (!invItem || invItem.quantity < req.quantity) return false;
    }
    return true;
  };

  const handleStartOrder = () => {
    if (!activeCharacter || !canAfford()) return;

    const duration = calculateDuration();
    const order: BlacksmithOrder = {
      id: Math.random().toString(36).substr(2, 9),
      characterId: activeCharacter.id,
      itemType: selectedSlot,
      minRarity: selectedRarity,
      minStat: selectedStat !== 'none' ? { type: selectedStat as keyof CharacterStats, value: statValue } : undefined,
      startTime: new Date(),
      duration: duration,
      remainingTime: duration,
      cost: calculateCost(),
      materials: getRequiredMaterials().map(m => ({ itemId: m.itemId, quantity: m.quantity })),
      status: 'active',
    };

    dispatch({ type: 'START_BLACKSMITH_ORDER', payload: order });
  };

  const handleClaim = (orderId: string) => {
    dispatch({ type: 'CLAIM_BLACKSMITH_ORDER', payload: orderId });
  };

  const activeOrders = state.blacksmithOrders.filter(o => o.characterId === activeCharacter?.id);

  return (
    <div className="game-card">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span>⚒️</span> The Blacksmith's Forge
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Creation */}
        <div className="space-y-6">
          <div className="bg-dark-800 p-4 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-fantasy-gold mb-4">Place Custom Order</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-300 mb-1">Equipment Slot</label>
                <select 
                  value={selectedSlot} 
                  onChange={(e) => setSelectedSlot(e.target.value as EquipmentSlot)}
                  className="w-full bg-dark-700 border border-dark-600 rounded p-2 text-white"
                >
                  {equipmentSlots.map(slot => (
                    <option key={slot} value={slot}>{slot.charAt(0).toUpperCase() + slot.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-1">Minimum Rarity</label>
                <div className="flex flex-wrap gap-2">
                  {rarities.map(rarity => (
                    <button
                      key={rarity}
                      onClick={() => setSelectedRarity(rarity)}
                      className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                        selectedRarity === rarity 
                          ? 'bg-primary-600 border-primary-400 text-white' 
                          : 'bg-dark-700 border-dark-600 text-dark-400 hover:border-dark-400'
                      }`}
                    >
                      {rarity.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-1">Minimum Stat (Optional)</label>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={selectedStat} 
                    onChange={(e) => setSelectedStat(e.target.value as any)}
                    className="bg-dark-700 border border-dark-600 rounded p-2 text-white"
                  >
                    <option value="none">No specific stat</option>
                    {statTypes.map(stat => (
                      <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
                    ))}
                  </select>
                  {selectedStat !== 'none' && (
                    <input 
                      type="number" 
                      value={statValue}
                      onChange={(e) => setStatValue(parseInt(e.target.value))}
                      className="bg-dark-700 border border-dark-600 rounded p-2 text-white"
                      min="1"
                      max="100"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-dark-600 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Gold Cost:</span>
                <span className="text-fantasy-gold font-bold">{calculateCost()} Gold</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Materials Required:</span>
                <div className="text-right">
                  {getRequiredMaterials().map(mat => (
                    <div key={mat.itemId} className="text-xs text-white">
                      {mat.quantity}x {mat.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Estimated Time:</span>
                <span className="text-blue-400">{(calculateDuration() / 60000).toFixed(1)} minutes</span>
              </div>

              <button
                onClick={handleStartOrder}
                disabled={!canAfford() || activeOrders.length >= 3}
                className={`w-full py-3 rounded-lg font-bold mt-4 transition-all ${
                  canAfford() && activeOrders.length < 3
                    ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg hover:shadow-orange-900/40'
                    : 'bg-dark-600 text-dark-400 cursor-not-allowed'
                }`}
              >
                {activeOrders.length >= 3 ? 'Max Slots Occupied' : canAfford() ? 'Forge Item' : 'Insufficient Resources'}
              </button>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Active Work Orders ({activeOrders.length}/3)</h3>
          <AnimatePresence>
            {activeOrders.length === 0 ? (
              <div className="text-dark-400 italic text-center py-8 bg-dark-800/50 rounded-lg border border-dashed border-dark-600">
                No orders currently in the forge.
              </div>
            ) : (
              activeOrders.map(order => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-dark-800 p-4 rounded-lg border border-dark-600 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white">
                        {order.minRarity.toUpperCase()} {order.itemType.toUpperCase()}
                      </h4>
                      {order.minStat && (
                        <p className="text-xs text-dark-300">
                          Target: {order.minStat.type} ≥ {order.minStat.value}
                        </p>
                      )}
                    </div>
                    {order.status === 'completed' ? (
                      <span className="text-green-400 font-bold text-xs animate-pulse">READY!</span>
                    ) : (
                      <span className="text-blue-400 text-xs">
                        {Math.floor(order.remainingTime / 60000)}m {Math.floor((order.remainingTime % 60000) / 1000)}s
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-dark-900 h-1.5 rounded-full mt-2">
                    <motion.div
                      className={`h-full rounded-full ${order.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${((order.duration - order.remainingTime) / order.duration) * 100}%` }}
                    />
                  </div>

                  {order.status === 'completed' && (
                    <button
                      onClick={() => handleClaim(order.id)}
                      className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 rounded transition-colors"
                    >
                      Claim Masterwork
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

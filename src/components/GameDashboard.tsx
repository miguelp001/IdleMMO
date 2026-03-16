import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { CharacterSheet } from './CharacterSheet';
import { InventoryGrid } from './InventoryGrid';
import { DungeonMap } from './DungeonMap';
import { FamilyTree } from './FamilyTree';
import { GuildPanel } from './GuildPanel';
import { CombatSystem } from './CombatSystem';
import { SaveLoadManager } from './SaveLoadManager';
import { BlacksmithForge } from './BlacksmithForge';
import WorldStatusView from './WorldStatusView';

type GameTab = 'character' | 'inventory' | 'dungeon' | 'family' | 'guild' | 'combat' | 'forge' | 'world' | 'save';

const tabs: Array<{
  id: GameTab;
  name: string;
  icon: string;
  description: string;
}> = [
  { id: 'character', name: 'Character', icon: '👤', description: 'View character stats and progression' },
  { id: 'inventory', name: 'Inventory', icon: '🎒', description: 'Manage equipment and items' },
  { id: 'dungeon', name: 'Dungeon', icon: '🏰', description: 'Explore dungeons and fight enemies' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', description: 'View family tree and lineage' },
  { id: 'guild', name: 'Guild', icon: '⚔️', description: 'Guild activities and members' },
  { id: 'combat', name: 'Combat', icon: '⚡', description: 'Active combat interface' },
  { id: 'forge', name: 'Forge', icon: '⚒️', description: 'Custom equipment forging' },
  { id: 'save', name: 'Save', icon: '💾', description: 'Save and load game data' },
  { id: 'world', name: 'World', icon: '🌎', description: 'View global events and factions' },
];

export const GameDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeCharacter } = useGame();
  const [activeTab, setActiveTab] = useState<GameTab>('character');

  // Redirect to character creation if no character exists
  if (!activeCharacter) {
    navigate('/');
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'character':
        return <CharacterSheet />;
      case 'inventory':
        return <InventoryGrid />;
      case 'dungeon':
        return <DungeonMap />;
      case 'family':
        return <FamilyTree />;
      case 'guild':
        return <GuildPanel />;
      case 'combat':
        return <CombatSystem />;
      case 'forge':
        return <BlacksmithForge />;
      case 'save':
        return <SaveLoadManager />;
      case 'world':
        return <WorldStatusView />;
      default:
        return <CharacterSheet />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-fantasy">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-fantasy text-fantasy-gold">IdleRPG</h1>
            <div className="text-white">
              <span className="font-medium">{activeCharacter.name}</span>
              <span className="text-dark-300 ml-2">Level {activeCharacter.level}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-fantasy-gold font-medium">{activeCharacter.gold} Gold</div>
              <div className="text-sm text-dark-300">
                {activeCharacter.experience}/{activeCharacter.experience + activeCharacter.experienceToNext} XP
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="game-button-secondary text-sm"
            >
              New Character
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="game-card sticky top-4">
              <h2 className="text-lg font-bold text-white mb-4">Game Menu</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                    }`}
                    title={tab.description}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.name}</span>
                    </div>
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
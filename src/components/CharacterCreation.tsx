import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { CharacterClass } from '../types/game';
import { generateSampleCharacter } from '../utils/gameInitializer';

const characterClasses: Array<{
  class: CharacterClass;
  name: string;
  description: string;
  icon: string;
  color: string;
  stats: string[];
}> = [
  {
    class: 'warrior',
    name: 'Warrior',
    description: 'A mighty warrior skilled in close combat and heavy armor.',
    icon: '⚔️',
    color: 'text-red-400',
    stats: ['High Health', 'Strong Attack', 'Heavy Armor'],
  },
  {
    class: 'mage',
    name: 'Mage',
    description: 'A powerful spellcaster who wields destructive magic.',
    icon: '🔮',
    color: 'text-blue-400',
    stats: ['High Mana', 'Powerful Spells', 'Elemental Magic'],
  },
  {
    class: 'rogue',
    name: 'Rogue',
    description: 'A stealthy assassin who strikes from the shadows.',
    icon: '🗡️',
    color: 'text-green-400',
    stats: ['High Agility', 'Stealth', 'Critical Hits'],
  },
  {
    class: 'cleric',
    name: 'Cleric',
    description: 'A divine healer who protects allies with holy magic.',
    icon: '✨',
    color: 'text-yellow-400',
    stats: ['Healing Magic', 'Divine Protection', 'Support Skills'],
  },
];

export const CharacterCreation: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [characterName, setCharacterName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCharacter = async () => {
    if (!characterName.trim() || !selectedClass) {
      return;
    }

    setIsCreating(true);

    try {
      const newCharacter = generateSampleCharacter(characterName.trim(), selectedClass);
      
      dispatch({
        type: 'CREATE_CHARACTER',
        payload: newCharacter,
      });

      // Navigate to game after a short delay
      setTimeout(() => {
        navigate('/game');
      }, 1000);
    } catch (error) {
      console.error('Failed to create character:', error);
      setIsCreating(false);
    }
  };

  const canCreate = characterName.trim().length >= 3 && selectedClass && !isCreating;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-fantasy text-fantasy-gold mb-4 text-shadow"
          >
            IdleRPG
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-dark-300 mb-8"
          >
            Create Your Legendary Character
          </motion.p>
        </div>

        {/* Character Creation Form */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Character Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="game-card">
              <h2 className="text-2xl font-bold text-white mb-4">Character Details</h2>
              
              {/* Character Name Input */}
              <div className="mb-6">
                <label htmlFor="characterName" className="block text-sm font-medium text-dark-300 mb-2">
                  Character Name
                </label>
                <input
                  id="characterName"
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter your character's name..."
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxLength={20}
                />
                <p className="text-xs text-dark-400 mt-1">
                  {characterName.length}/20 characters
                </p>
              </div>

              {/* Character Preview */}
              {selectedClass && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-dark-700 rounded-lg p-4 border border-dark-600"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">Character Preview</h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">
                      {characterClasses.find(c => c.class === selectedClass)?.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{characterName || 'Unnamed'}</p>
                      <p className={`text-sm ${characterClasses.find(c => c.class === selectedClass)?.color}`}>
                        Level 1 {characterClasses.find(c => c.class === selectedClass)?.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Class Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <div className="game-card">
              <h2 className="text-2xl font-bold text-white mb-4">Choose Your Class</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {characterClasses.map((charClass) => (
                  <motion.button
                    key={charClass.class}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedClass(charClass.class)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedClass === charClass.class
                        ? 'border-primary-500 bg-primary-900/20'
                        : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{charClass.icon}</span>
                      <span className={`font-bold ${charClass.color}`}>{charClass.name}</span>
                    </div>
                    <p className="text-sm text-dark-300 mb-3">{charClass.description}</p>
                    <div className="space-y-1">
                      {charClass.stats.map((stat, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-xs text-fantasy-gold">•</span>
                          <span className="text-xs text-dark-300">{stat}</span>
                        </div>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={handleCreateCharacter}
              disabled={!canCreate}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
                canCreate
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl'
                  : 'bg-dark-700 text-dark-400 cursor-not-allowed'
              }`}
            >
              {isCreating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Character...</span>
                </div>
              ) : (
                'Create Character'
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-8 text-dark-400"
        >
          <p className="text-sm">
            Begin your journey in the world of IdleRPG
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 
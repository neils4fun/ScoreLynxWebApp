import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Game } from '../types/game';

interface GameFormScreenProps {
  onBack: () => void;
  game?: Game; // Optional game prop for edit mode
  onUpdateGame: (gameSettings: any, gameOptions: any) => void;
  onAddGame: (gameSettings: any, gameOptions: any) => void;
}

export function GameFormScreen({ onBack, game, onUpdateGame, onAddGame }: GameFormScreenProps) {
  const isEditMode = !!game;

  const [gameSettings, setGameSettings] = useState({
    gameDate: '',
    gameType: '',
    skinsType: '',
    course: '',
    gameAnte: '',
    skinsAnte: '',
    payouts: 'No Payouts Set',
    mirrorGame: ''
  });

  const [gameOptions, setGameOptions] = useState({
    showNotifications: false,
    showPaceOfPlay: false,
    showLeaderboard: false,
    showSkins: false,
    showPayouts: false,
    useGroupHandicaps: false,
    strokeOffLowHandicap: false,
    percentHandicapHaircut: 100,
    addRakeToPayouts: true,
    breakTiesOnPayouts: false
  });

  // Populate form when editing existing game
  useEffect(() => {
    if (game) {
      setGameSettings({
        gameDate: game.date || '',
        gameType: game.gameType || '',
        skinsType: game.skinType || '',
        course: game.courseName || '',
        gameAnte: '',  // Add these fields to Game type if they exist
        skinsAnte: '',
        payouts: 'No Payouts Set',
        mirrorGame: ''
      });

      // You might need to adjust these mappings based on your actual Game type
      setGameOptions({
        showNotifications: game.showNotifications === '1',
        showPaceOfPlay: game.showPaceOfPlay === '1',
        showLeaderboard: game.showLeaderBoard === '1',
        showSkins: game.showSkins === '1',
        showPayouts: game.showPayouts === '1',
        useGroupHandicaps: game.useGroupHandicaps === '1',
        strokeOffLowHandicap: game.strokeOffLow === '1',
        percentHandicapHaircut: Math.min(parseInt(game.percentHandicap) || 100, 100),
        addRakeToPayouts: game.addRakeToPayouts === '1',
        breakTiesOnPayouts: game.breakTiesOnPayouts === '1' || false
      });
    }
  }, [game]);

  const handleUpdateGame = () => {
    if (!game) return;
    onUpdateGame(gameSettings, gameOptions);
  };

  const handleAddGame = () => {
    onAddGame(gameSettings, gameOptions);
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white p-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-blue-500"
          >
            <ArrowLeft className="w-6 h-6 mr-1" />
            <span>Test Games</span>
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-8">
            {isEditMode ? 'Update Game' : 'Add Game'}
          </h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Game Settings Section */}
          <div className="mb-6">
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-lg">Game Settings</h2>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {Object.entries(gameSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between px-4 py-3">
                  <span className="text-base">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex items-center text-gray-500">
                    <span className={value ? 'text-black' : 'text-gray-400'}>
                      {value || `Select ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                    </span>
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Options Section */}
          <div className="mb-20">
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-lg">Game Options</h2>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {Object.entries(gameOptions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between px-4 py-3">
                  <span className="text-base">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {typeof value === 'boolean' ? (
                    <div 
                      className={`w-12 h-7 rounded-full relative ${
                        value ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          value ? 'right-1' : 'left-1'
                        }`} 
                      />
                    </div>
                  ) : (
                    <span className="text-right">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Button */}
      <div className="fixed bottom-16 inset-x-0 max-w-md mx-auto p-4 bg-gray-100">
        <button
          onClick={isEditMode ? handleUpdateGame : handleAddGame}
          className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium"
        >
          {isEditMode ? 'Update Game' : 'Add Game'}
        </button>
      </div>
    </div>
  );
} 
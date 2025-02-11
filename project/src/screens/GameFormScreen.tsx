import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Game } from '../types/game';
import type { GameMeta } from '../types/gameMeta';
import DatePicker from "react-datepicker";
import { GameTypeSelector } from '../components/game/GameTypeSelector';
type DatePickerComponent = typeof DatePicker;
const ReactDatePicker = DatePicker as DatePickerComponent;
import "react-datepicker/dist/react-datepicker.css";

interface GameFormScreenProps {
  onBack: () => void;
  game?: Game; // Optional game prop for edit mode
}

interface GameSettings {
  gameDate: Date;
  gameType: string;
  skinsType: string;
  course: string;
  gameAnte: string;
  skinsAnte: string;
  payouts: string;
  mirrorGame: string;
}

export function GameFormScreen({ onBack, game }: GameFormScreenProps) {
  const isEditMode = !!game;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGameTypeSelector, setShowGameTypeSelector] = useState(false);

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    gameDate: new Date(),  // Initialize with current date
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
    addRakeToPayouts: true
  });

  // Populate form when editing existing game
  useEffect(() => {
    if (game) {
      setGameSettings({
        gameDate: game.date ? new Date(game.date) : new Date(),
        gameType: game.gameType || '',
        skinsType: game.skinType || '',
        course: game.courseName || '',
        gameAnte: '',
        skinsAnte: '',
        payouts: 'No Payouts Set',
        mirrorGame: ''
      });

      // You might need to adjust these mappings based on your actual Game type
      setGameOptions({
        ...gameOptions,
        // Map game properties to options as needed
      });
    }
  }, [game]);

  const handleSubmit = () => {
    if (isEditMode) {
      console.log('Update game clicked', { gameSettings, gameOptions });
      // TODO: Implement update logic
    } else {
      console.log('Add game clicked', { gameSettings, gameOptions });
      // TODO: Implement create logic
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setGameSettings(prev => ({ ...prev, gameDate: date }));
      setShowDatePicker(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleGameTypeSelect = (selectedGameType: GameMeta) => {
    setGameSettings(prev => ({
      ...prev,
      gameType: selectedGameType.type
    }));
    setShowGameTypeSelector(false);
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
              <h2 className="text-lg">Game Settings:</h2>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {/* Game Date Row */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base">Game Date:</span>
                <div 
                  className="flex items-center text-gray-500 cursor-pointer"
                  onClick={() => setShowDatePicker(true)}
                >
                  <span className="text-black">{formatDate(gameSettings.gameDate)}</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              {/* Game Type Row */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base">Game Type:</span>
                <div 
                  className="flex items-center text-gray-500 cursor-pointer"
                  onClick={() => setShowGameTypeSelector(true)}
                >
                  <span className={gameSettings.gameType ? 'text-black' : 'text-gray-400'}>
                    {gameSettings.gameType || 'Select Game Type'}
                  </span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              {/* Other settings rows */}
              {Object.entries(gameSettings).map(([key, value]) => {
                if (key === 'gameDate' || key === 'gameType') return null;
                return (
                  <div key={key} className="flex items-center justify-between px-4 py-3">
                    <span className="text-base">
                      {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()) + ':'}
                    </span>
                    <div className="flex items-center text-gray-500">
                      <span className={value ? 'text-black' : 'text-gray-400'}>
                        {value || `Select ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                      </span>
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game Options Section */}
          <div className="mb-20">
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-lg">Game Options:</h2>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {Object.entries(gameOptions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between px-4 py-3">
                  <span className="text-base">
                    {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()) + ':'}
                  </span>
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

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <ReactDatePicker
              selected={gameSettings.gameDate}
              onChange={handleDateChange}
              inline
              minDate={new Date()}
              className="w-full"
            />
            <button
              onClick={() => setShowDatePicker(false)}
              className="w-full mt-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Game Type Selector */}
      {showGameTypeSelector && (
        <GameTypeSelector
          onBack={() => setShowGameTypeSelector(false)}
          onSelect={handleGameTypeSelect}
        />
      )}

      {/* Fixed Button */}
      <div className="fixed bottom-16 inset-x-0 max-w-md mx-auto p-4 bg-gray-100">
        <button
          onClick={handleSubmit}
          className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium"
        >
          {isEditMode ? 'Update Game' : 'Add Game'}
        </button>
      </div>
    </div>
  );
} 
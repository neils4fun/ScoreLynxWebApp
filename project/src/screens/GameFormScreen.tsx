import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Game } from '../types/game';
import type { GameMeta } from '../types/gameMeta';
import type { SkinsMeta } from '../types/skinsMeta';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { GameTypeSelector } from '../components/game/GameTypeSelector';
import { SkinsTypeSelector } from '../components/game/SkinsTypeSelector';
import { CourseSelector } from '../components/game/CourseSelector';
import { addGame } from '../api/gameApi';
import { useGroup } from '../context/GroupContext';
import { APP_VERSION, APP_SOURCE } from '../api/config';

// Create a theme instance
const theme = createTheme();

interface GameFormScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
  game?: Game;
}

interface GameSettings {
  gameDate: Date | null;
  gameType: string;
  skinsType: string;
  course: string;
  courseId: string;  // Hidden field for API
  teeId: string;     // Hidden field for API
  gameAnte: string;
  skinsAnte: string;
  payouts: string;
  mirrorGame: string;
}

interface GameOptions {
  showNotifications: boolean;
  showPaceOfPlay: boolean;
  showLeaderboard: boolean;
  showSkins: boolean;
  showPayouts: boolean;
  useGroupHandicaps: boolean;
  strokeOffLowHandicap: boolean;
  percentHandicapHaircut: number;
  addRakeToPayouts: boolean;
}

export function GameFormScreen({ onBack, onSuccess, game }: GameFormScreenProps) {
  const { selectedGroup } = useGroup();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameMeta, setSelectedGameMeta] = useState<GameMeta | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize form data from game prop if provided
  useEffect(() => {
    if (game) {
      setGameSettings({
        gameDate: new Date(game.date),
        gameType: game.gameType,
        skinsType: game.skinType,
        course: `${game.courseName} - ${game.teeName}`,
        courseId: game.courseID,
        teeId: game.teeID,
        gameAnte: '',
        skinsAnte: '',
        payouts: 'No Payouts Set',
        mirrorGame: ''
      });
    }
  }, [game]);

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    gameDate: new Date(),
    gameType: '',
    skinsType: '',
    course: '',
    courseId: '',
    teeId: '',
    gameAnte: '',
    skinsAnte: '',
    payouts: 'No Payouts Set',
    mirrorGame: ''
  });

  const [gameOptions, setGameOptions] = useState<GameOptions>({
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

  const [showGameTypeSelector, setShowGameTypeSelector] = useState(false);
  const [showSkinsTypeSelector, setShowSkinsTypeSelector] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);

  const isFormComplete = () => {
    return (
      gameSettings.gameDate !== null &&
      gameSettings.gameType !== '' &&
      gameSettings.skinsType !== '' &&
      gameSettings.courseId !== '' &&
      gameSettings.teeId !== ''
    );
  };

  const handleSubmit = async () => {
    if (!selectedGroup || !gameSettings.gameDate) return;
    
    setIsSubmitting(true);
    setError(null);

    const gameKey = formatDateToGameKey(gameSettings.gameDate);

    try {
      await addGame({
        showPaceOfPlay: gameOptions.showPaceOfPlay ? 1 : 0,
        strokeOffLow: gameOptions.strokeOffLowHandicap ? 1 : 0,
        groupName: selectedGroup.groupName,
        useGroupHandicaps: gameOptions.useGroupHandicaps ? 1 : 0,
        deviceID: 'Web',
        showLeaderBoard: gameOptions.showLeaderboard ? 1 : 0,
        venmoName: null,
        percentHandicap: gameOptions.percentHandicapHaircut,
        addRakeToPayouts: gameOptions.addRakeToPayouts ? 1 : 0,
        skinType: gameSettings.skinsType,
        payouts: [],
        appVersion: APP_VERSION,
        gameKey,
        courseID: gameSettings.courseId,
        mirrorGameID: null,
        teeID: gameSettings.teeId,
        showPayouts: gameOptions.showPayouts ? 1 : 0,
        gameType: gameSettings.gameType,
        tournamentName: gameKey,
        showSkins: gameOptions.showSkins ? 1 : 0,
        showNotifications: gameOptions.showNotifications ? 1 : 0,
        round: 1,
        teamCount: 0,
        source: APP_SOURCE,
        skinsAnte: parseInt(gameSettings.skinsAnte) || 0,
        gameAnte: parseInt(gameSettings.gameAnte) || 0,
        ownerDeviceID: 'SLPWeb',
        teamPlayerType: selectedGameMeta?.teamPlayerType || 'Player'
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add game');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateToGameKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
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
    setSelectedGameMeta(selectedGameType);
    setGameSettings(prev => ({
      ...prev,
      gameType: selectedGameType.type
    }));
    setShowGameTypeSelector(false);
  };

  const handleSkinsTypeSelect = (selectedSkinsType: SkinsMeta) => {
    setGameSettings(prev => ({
      ...prev,
      skinsType: selectedSkinsType.type
    }));
    setShowSkinsTypeSelector(false);
  };

  const handleCourseSelect = (courseId: string, courseName: string, teeId: string, teeName: string) => {
    setGameSettings(prev => ({
      ...prev,
      course: `${courseName} - ${teeName}`,
      courseId,
      teeId
    }));
    setShowCourseSelector(false);
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
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-8">
            Add Game
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Game Settings Section */}
          <div className="mb-6">
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-lg">Game Settings</h2>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setShowDatePicker(true)}
              >
                <span>Game Date</span>
                <div className="flex items-center text-gray-500">
                  <span className={gameSettings.gameDate ? 'text-black' : ''}>
                    {gameSettings.gameDate ? formatDate(gameSettings.gameDate) : 'Select Game Date'}
                  </span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setShowGameTypeSelector(true)}
              >
                <span>Game Type</span>
                <div className="flex items-center text-gray-500">
                  <span className={gameSettings.gameType ? 'text-black' : ''}>
                    {gameSettings.gameType || 'Select Game Type'}
                  </span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setShowSkinsTypeSelector(true)}
              >
                <span>Skins Type</span>
                <div className="flex items-center text-gray-500">
                  <span className={gameSettings.skinsType ? 'text-black' : ''}>
                    {gameSettings.skinsType || 'Select Skins Type'}
                  </span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setShowCourseSelector(true)}
              >
                <span>Course/Tee</span>
                <div className="flex items-center text-gray-500">
                  <span className={gameSettings.course ? 'text-black' : ''}>
                    {gameSettings.course || 'Select Course/Tee'}
                  </span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
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
                      className={`w-12 h-7 rounded-full relative cursor-pointer ${
                        value ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                      onClick={() => setGameOptions(prev => ({
                        ...prev,
                        [key]: !value
                      }))}
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
          onClick={handleSubmit}
          disabled={!isFormComplete() || isSubmitting}
          className={`w-full py-3 rounded-lg font-medium
            ${isFormComplete() && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          {isSubmitting ? 'Adding Game...' : 'Add Game'}
        </button>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={gameSettings.gameDate ? dayjs(gameSettings.gameDate) : null}
                  onChange={(date) => {
                    if (date) {
                      setGameSettings(prev => ({
                        ...prev,
                        gameDate: date.toDate()
                      }));
                      setShowDatePicker(false);
                    }
                  }}
                />
              </LocalizationProvider>
            </ThemeProvider>
            <button
              onClick={() => setShowDatePicker(false)}
              className="w-full mt-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showGameTypeSelector && (
        <GameTypeSelector
          onBack={() => setShowGameTypeSelector(false)}
          onSelect={handleGameTypeSelect}
        />
      )}

      {showSkinsTypeSelector && (
        <SkinsTypeSelector
          onBack={() => setShowSkinsTypeSelector(false)}
          onSelect={handleSkinsTypeSelect}
        />
      )}

      {showCourseSelector && (
        <CourseSelector
          onCancel={() => setShowCourseSelector(false)}
          onSelect={handleCourseSelect}
        />
      )}
    </div>
  );
} 
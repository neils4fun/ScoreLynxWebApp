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
import { PayoutsEditor } from '../components/game/PayoutsEditor';
import { addGame, updateGame, fetchGamePayoutsList } from '../api/gameApi';
import { useGroup } from '../context/GroupContext';
import { APP_VERSION, APP_SOURCE, DEVICE_ID } from '../api/config';
import { MirrorGameSelector } from '../components/game/MirrorGameSelector';

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
  payouts: string;   // Display string for UI
  payoutValues: number[];  // Internal array for API
  mirrorGame: string;
  mirrorGameId: string | null;
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
  const isEditMode = !!game;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameMeta, setSelectedGameMeta] = useState<GameMeta | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayoutsEditor, setShowPayoutsEditor] = useState(false);

  // Initialize form data from game prop if provided
  useEffect(() => {
    if (game) {
      // Parse the game date from the gameKey (YYYYMMDD format)
      const year = parseInt(game.gameKey.substring(0, 4));
      const month = parseInt(game.gameKey.substring(4, 6)) - 1; // months are 0-based
      const day = parseInt(game.gameKey.substring(6, 8));
      const gameDate = new Date(year, month, day);

      setGameSettings({
        gameDate,
        gameType: game.gameType,
        skinsType: game.skinType,
        course: `${game.courseName} - ${game.teeName}`,
        courseId: game.courseID,
        teeId: game.teeID,
        gameAnte: game.gameAnte || '0.0',
        skinsAnte: game.skinsAnte || '0.0',
        payouts: 'Loading payouts...',
        payoutValues: [],
        mirrorGame: game.mirrorGameName || '',
        mirrorGameId: game.mirrorGameID
      });

      setGameOptions({
        showNotifications: game.showNotifications === '1',
        showPaceOfPlay: game.showPaceOfPlay === '1',
        showLeaderboard: game.showLeaderBoard === '1',
        showSkins: game.showSkins === '1',
        showPayouts: game.showPayouts === '1',
        useGroupHandicaps: game.useGroupHandicaps === '1',
        strokeOffLowHandicap: game.strokeOffLow === '1',
        percentHandicapHaircut: Math.min(parseInt(game.percentHandicap) || 100, 100),
        addRakeToPayouts: game.addRakeToPayouts === '1'
      });

      // Fetch payouts list when editing a game
      const loadPayouts = async () => {
        setIsLoading(true);
        try {
          const response = await fetchGamePayoutsList(game.gameID);
          
          if (response.status.code === 135 || !response.payouts || response.payouts.length === 0) {
            setGameSettings(prev => ({
              ...prev,
              payouts: 'No Payouts Set',
              payoutValues: []
            }));
          } else {
            // The response.payouts is already an array of integers
            setGameSettings(prev => ({
              ...prev,
              payouts: response.payouts.join(', '),
              payoutValues: response.payouts
            }));
          }
        } catch (err) {
          setGameSettings(prev => ({
            ...prev,
            payouts: 'No Payouts Set',
            payoutValues: []
          }));
        } finally {
          setIsLoading(false);
        }
      };

      loadPayouts();
    }
  }, [game]);

  const [gameSettings, setGameSettings] = useState<GameSettings>(() => {
    // If editing a game, use the game's settings
    if (isEditMode && game) {
      return {
        gameDate: game.date ? new Date(game.date) : null,
        gameType: game.gameType || '',
        skinsType: game.skinType || '',
        course: game ? `${game.courseName} - ${game.teeName}` : '',
        courseId: game.courseID || '',
        teeId: game.teeID || '',
        gameAnte: game.gameAnte || '',
        skinsAnte: game.skinsAnte || '',
        payouts: '',
        payoutValues: [],
        mirrorGame: game.mirrorGameName || '',
        mirrorGameId: game.mirrorGameID || null
      };
    }
    
    // For new games, try to load saved settings
    const savedSettings = localStorage.getItem('lastGameSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return {
        ...parsed,
        gameDate: new Date(), // Always use current date for new games
        mirrorGame: '', // Reset mirror game for new games
        mirrorGameId: null
      };
    }

    // Default settings for first-time use
    return {
      gameDate: new Date(),
      gameType: '',
      skinsType: '',
      course: '',
      courseId: '',
      teeId: '',
      gameAnte: '',
      skinsAnte: '',
      payouts: '',
      payoutValues: [],
      mirrorGame: '',
      mirrorGameId: null
    };
  });

  const [gameOptions, setGameOptions] = useState<GameOptions>(() => {
    // If editing a game, use the game's options
    if (isEditMode && game) {
      return {
        showNotifications: game.showNotifications === '1',
        showPaceOfPlay: game.showPaceOfPlay === '1',
        showLeaderboard: game.showLeaderBoard === '1',
        showSkins: game.showSkins === '1',
        showPayouts: game.showPayouts === '1',
        useGroupHandicaps: game.useGroupHandicaps === '1',
        strokeOffLowHandicap: game.strokeOffLow === '1',
        percentHandicapHaircut: Math.min(parseInt(game.percentHandicap) || 100, 100),
        addRakeToPayouts: game.addRakeToPayouts === '1'
      };
    }

    // For new games, try to load saved options
    const savedOptions = localStorage.getItem('lastGameOptions');
    if (savedOptions) {
      const parsed = JSON.parse(savedOptions);
      // Ensure addRakeToPayouts is set to true for new games even if saved options exist
      return {
        ...parsed,
        addRakeToPayouts: true
      };
    }

    // Default options for first-time use
    return {
      showNotifications: false,
      showPaceOfPlay: false,
      showLeaderboard: false,
      showSkins: false,
      showPayouts: false,
      useGroupHandicaps: false,
      strokeOffLowHandicap: false,
      percentHandicapHaircut: 100,
      addRakeToPayouts: true // Default to true for new games
    };
  });

  // Save settings when they change
  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem('lastGameSettings', JSON.stringify(gameSettings));
      localStorage.setItem('lastGameOptions', JSON.stringify(gameOptions));
    }
  }, [gameSettings, gameOptions, isEditMode]);

  const [showGameTypeSelector, setShowGameTypeSelector] = useState(false);
  const [showSkinsTypeSelector, setShowSkinsTypeSelector] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [showMirrorGameSelector, setShowMirrorGameSelector] = useState(false);

  const isFormComplete = () => {
    return (
      gameSettings.gameDate !== null &&
      gameSettings.gameType !== '' &&
      gameSettings.skinsType !== '' &&
      gameSettings.courseId !== '' &&
      gameSettings.teeId !== ''
    );
  };

  const formatDateToGameKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const handleSubmit = async () => {
    if (!selectedGroup || !gameSettings.gameDate) return;
    
    setIsSubmitting(true);
    setError(null);

    const gameKey = formatDateToGameKey(gameSettings.gameDate);

    try {
      const params = {
        showPaceOfPlay: gameOptions.showPaceOfPlay ? 1 : 0,
        strokeOffLow: gameOptions.strokeOffLowHandicap ? 1 : 0,
        groupName: selectedGroup.groupName,
        useGroupHandicaps: gameOptions.useGroupHandicaps ? 1 : 0,
        deviceID: DEVICE_ID,
        showLeaderBoard: gameOptions.showLeaderboard ? 1 : 0,
        venmoName: null,
        percentHandicap: gameOptions.percentHandicapHaircut,
        addRakeToPayouts: gameOptions.addRakeToPayouts ? 1 : 0,
        skinType: gameSettings.skinsType,
        payouts: gameSettings.payoutValues,
        appVersion: APP_VERSION,
        gameKey,
        courseID: gameSettings.courseId,
        mirrorGameID: gameSettings.mirrorGameId,
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
        teamPlayerType: gameSettings.gameType !== game?.gameType 
          ? selectedGameMeta?.teamPlayerType || 'Player'
          : game?.teamPlayerType
      };

      if (isEditMode && game) {
        await updateGame({
          gameID: game.gameID,
          showPaceOfPlay: gameOptions.showPaceOfPlay ? 1 : 0,
          strokeOffLow: gameOptions.strokeOffLowHandicap ? 1 : 0,
          groupName: selectedGroup.groupName,
          useGroupHandicaps: gameOptions.useGroupHandicaps ? 1 : 0,
          deviceID: 'SLPWeb',
          showLeaderBoard: gameOptions.showLeaderboard ? 1 : 0,
          venmoName: null,
          percentHandicap: gameOptions.percentHandicapHaircut,
          addRakeToPayouts: gameOptions.addRakeToPayouts ? 1 : 0,
          skinType: gameSettings.skinsType,
          payouts: gameSettings.payoutValues,
          appVersion: APP_VERSION,
          gameKey: gameKey,
          courseID: gameSettings.courseId,
          mirrorGameID: gameSettings.mirrorGameId,
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
          teamPlayerType: gameSettings.gameType !== game?.gameType 
            ? selectedGameMeta?.teamPlayerType || 'Player'
            : game?.teamPlayerType,
          ownerDeviceID: 'SLPWeb'
        });
      } else {
        await addGame({
          ...params,
          ownerDeviceID: 'SLPWeb'
        });
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'add'} game`);
    } finally {
      setIsSubmitting(false);
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

  const handleMirrorGameSelect = (gameId: string, gameName: string) => {
    setGameSettings(prev => ({
      ...prev,
      mirrorGameId: gameId,
      mirrorGame: gameName
    }));
    setShowMirrorGameSelector(false);
  };

  const handlePayoutsSave = (payouts: number[]) => {
    setGameSettings(prev => ({
      ...prev,
      payouts: payouts.length > 0 ? `${payouts.join(', ')}` : 'No Payouts Set',
      payoutValues: payouts
    }));
    setShowPayoutsEditor(false);
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
            {isEditMode ? 'Update Game' : 'Add Game'}
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
                <span>Game Date:</span>
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
                <span>Game Type:</span>
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
                <span>Skins Type:</span>
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
                <span>Course/Tee:</span>
                <div className="flex items-center text-gray-500">
                  <div className={`${gameSettings.course ? 'text-black' : ''} text-right`}>
                    {gameSettings.course ? (
                      <>
                        <div>{gameSettings.course.split(' - ')[0]}</div>
                        <div className="text-sm">{gameSettings.course.split(' - ')[1]}</div>
                      </>
                    ) : (
                      'Select Course/Tee'
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span>Game Ante:</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="1.0"
                    value={gameSettings.gameAnte}
                    onChange={(e) => setGameSettings(prev => ({
                      ...prev,
                      gameAnte: e.target.value
                    }))}
                    className="w-24 px-2 py-1 text-right border rounded"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span>Skins Ante:</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="1.0"
                    value={gameSettings.skinsAnte}
                    onChange={(e) => setGameSettings(prev => ({
                      ...prev,
                      skinsAnte: e.target.value
                    }))}
                    className="w-24 px-2 py-1 text-right border rounded"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setShowPayoutsEditor(true)}
              >
                <span className="text-base">Payouts:</span>
                <div className="flex items-center text-gray-500">
                  <span className={gameSettings.payouts ? 'text-black' : ''}>
                    {isLoading ? 'Loading...' : gameSettings.payouts}
                  </span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => !isEditMode && setShowMirrorGameSelector(true)}
              >
                <span className="text-base">Mirror Game:</span>
                <div className="flex items-center text-gray-500">
                  <span className={gameSettings.mirrorGame ? 'text-black' : ''}>
                    {gameSettings.mirrorGame || 'None'}
                  </span>
                  {!isEditMode && <ChevronRight className="w-5 h-5 ml-2" />}
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
              {Object.entries(gameOptions).map(([key, value]) => {
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                if (key === 'percentHandicapHaircut') {
                  return (
                    <div key={key} className="flex items-center justify-between px-4 py-3">
                      <span className="text-base">{label}:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={value}
                        onChange={(e) => setGameOptions(prev => ({
                          ...prev,
                          percentHandicapHaircut: parseInt(e.target.value) || 0
                        }))}
                        className="w-24 px-2 py-1 text-right border rounded"
                      />
                    </div>
                  );
                }

                return (
                  <div key={key} className="flex items-center justify-between px-4 py-3">
                    <span className="text-base">{label}:</span>
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
                );
              })}
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
              : 'bg-gray-400 text-white cursor-not-allowed'}`}
        >
          {isSubmitting 
            ? `${isEditMode ? 'Updating' : 'Adding'} Game...` 
            : isEditMode ? 'Update Game' : 'Add Game'}
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

      {showMirrorGameSelector && selectedGroup && gameSettings.gameDate && (
        <MirrorGameSelector
          onBack={() => setShowMirrorGameSelector(false)}
          onSelect={handleMirrorGameSelect}
          groupId={selectedGroup.groupID}
          gameKey={formatDateToGameKey(gameSettings.gameDate)}
        />
      )}

      {showPayoutsEditor && (
        <PayoutsEditor
          onBack={() => setShowPayoutsEditor(false)}
          onSave={handlePayoutsSave}
          initialPayouts={gameSettings.payoutValues}
        />
      )}
    </div>
  );
} 
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

// Create a theme instance
const theme = createTheme();

interface GameFormScreenProps {
  onBack: () => void;
  game?: Game; // Optional game prop for edit mode
}

interface GameSettings {
  gameDate: Date;
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

export function GameFormScreen({ onBack, game }: GameFormScreenProps) {
  const isEditMode = !!game;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGameTypeSelector, setShowGameTypeSelector] = useState(false);
  const [showSkinsTypeSelector, setShowSkinsTypeSelector] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    gameDate: new Date(),
    gameType: '',
    skinsType: '',
    course: '',
    courseId: '',  // Hidden field
    teeId: '',     // Hidden field
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
        courseId: game.courseID || '',
        teeId: '',
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

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setGameSettings(prev => ({ ...prev, gameDate: date.toDate() }));
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
      courseId: courseId,
      teeId: teeId
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
              {Object.entries(gameSettings)
                .filter(([key]) => !['courseId', 'teeId'].includes(key)) // Hide these fields from UI
                .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between px-4 py-3">
                  <span className="text-base">
                    {key.replace(/([A-Z])/g, ' $1').trim()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ') + ':'}
                  </span>
                  <div 
                    className="flex items-center text-gray-500 cursor-pointer"
                    onClick={() => {
                      if (key === 'gameDate') setShowDatePicker(true);
                      if (key === 'gameType') setShowGameTypeSelector(true);
                      if (key === 'skinsType') setShowSkinsTypeSelector(true);
                      if (key === 'course') setShowCourseSelector(true);
                    }}
                  >
                    <span className={value ? 'text-black' : 'text-gray-400'}>
                      {key === 'gameDate' ? formatDate(value as Date) : (value || 
                        key === 'course' ? 'Select Course/Tee' :
                        `Select ${key.replace(/([A-Z])/g, ' $1').trim()
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')}`
                      )}
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
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(gameSettings.gameDate)}
                  onChange={handleDateChange}
                  format="MM/DD/YYYY"
                  slotProps={{
                    textField: {
                      className: "w-full p-2 border rounded",
                      placeholder: "Select date"
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

      {/* Game Type Selector */}
      {showGameTypeSelector && (
        <GameTypeSelector
          onBack={() => setShowGameTypeSelector(false)}
          onSelect={handleGameTypeSelect}
        />
      )}

      {/* Skins Type Selector */}
      {showSkinsTypeSelector && (
        <SkinsTypeSelector
          onBack={() => setShowSkinsTypeSelector(false)}
          onSelect={handleSkinsTypeSelect}
        />
      )}

      {/* Course Selector */}
      {showCourseSelector && (
        <CourseSelector
          onCancel={() => setShowCourseSelector(false)}
          onSelect={handleCourseSelect}
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
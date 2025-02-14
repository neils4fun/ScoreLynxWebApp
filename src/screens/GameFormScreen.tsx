import React, { useEffect, useState } from 'react';
import type { Game } from '../types/game';

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
  teeID: string;     // Hidden field for API
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

const GameFormScreen = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    gameDate: new Date(),
    gameType: '',
    skinsType: '',
    course: '',
    courseId: '',
    teeID: '',
    gameAnte: '',
    skinsAnte: '',
    payouts: 'No Payouts Set',
    mirrorGame: ''
  });

  useEffect(() => {
    if (game) {
      setGameSettings({
        gameDate: new Date(game.date),
        gameType: game.gameType,
        skinsType: game.skinType,
        course: `${game.courseName} - ${game.teeName}`,
        courseId: game.courseID,
        teeID: game.teeName,
        gameAnte: '',
        skinsAnte: '',
        payouts: 'No Payouts Set',
        mirrorGame: ''
      });
    }
  }, [game]);

  const handleCourseSelect = (courseId: string, courseName: string, teeID: string, teeName: string) => {
    setGameSettings(prev => ({
      ...prev,
      course: `${courseName} - ${teeName}`,
      courseId,
      teeID
    }));
    setShowCourseSelector(false);
  };

  const isFormComplete = () => {
    return (
      gameSettings.gameDate !== null &&
      gameSettings.gameType !== '' &&
      gameSettings.skinsType !== '' &&
      gameSettings.courseId !== '' &&
      gameSettings.teeID !== ''
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
        teeID: gameSettings.teeID,
        showPayouts: gameOptions.showPayouts ? 1 : 0,
        gameType: gameSettings.gameType,
        tournamentName: gameKey,
        showSkins: gameOptions.showSkins ? 1 : 0,
        showNotifications: gameOptions.showNotifications ? 1 : 0,
        round: 1,
        teamCount: 0,
        source: APP_SOURCE,
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

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default GameFormScreen; 
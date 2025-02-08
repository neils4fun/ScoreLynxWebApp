import { useState, useEffect } from 'react';
import type { Game } from '../types/game';

export function useGame() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(() => {
    const saved = localStorage.getItem('selectedGame');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (selectedGame) {
      localStorage.setItem('selectedGame', JSON.stringify(selectedGame));
    } else {
      localStorage.removeItem('selectedGame');
    }
  }, [selectedGame]);

  return { selectedGame, setSelectedGame };
} 
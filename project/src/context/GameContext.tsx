import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Game } from '../types/game';

interface GameContextType {
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  clearGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
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

  const clearGame = () => {
    setSelectedGame(null);
    localStorage.removeItem('selectedGame');
  };

  return (
    <GameContext.Provider value={{ selectedGame, setSelectedGame, clearGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
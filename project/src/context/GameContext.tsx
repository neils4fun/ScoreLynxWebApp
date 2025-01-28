import { createContext, useContext } from 'react';
import type { Game } from '../types/game';
import { useGroup } from './GroupContext';

interface GameContextType {
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { selectedGame: groupSelectedGame, setSelectedGame: setGroupSelectedGame } = useGroup();
  
  // Use the group's selected game as the source of truth
  const setSelectedGame = (game: Game | null) => {
    setGroupSelectedGame(game);
  };

  return (
    <GameContext.Provider
      value={{
        selectedGame: groupSelectedGame,
        setSelectedGame
      }}
    >
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
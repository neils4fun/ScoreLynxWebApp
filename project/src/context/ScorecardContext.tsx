import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Player } from '../types/scorecard';

interface ScorecardContextType {
  scorecardId: string | null;
  setCurrentScorecard: (id: string | null) => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  clearScorecard: () => void;
}

const ScorecardContext = createContext<ScorecardContextType | undefined>(undefined);

export function ScorecardProvider({ children }: { children: ReactNode }) {
  const [scorecardId, setScorecardId] = useState<string | null>(() => {
    return localStorage.getItem('scorecardId');
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('scorecardPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (scorecardId) {
      localStorage.setItem('scorecardId', scorecardId);
    } else {
      localStorage.removeItem('scorecardId');
    }
  }, [scorecardId]);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('scorecardPlayers', JSON.stringify(players));
    } else {
      localStorage.removeItem('scorecardPlayers');
    }
  }, [players]);

  const setCurrentScorecard = (id: string | null) => {
    setScorecardId(id);
  };

  const clearScorecard = () => {
    setScorecardId(null);
    setPlayers([]);
    localStorage.removeItem('scorecardId');
    localStorage.removeItem('scorecardPlayers');
  };

  return (
    <ScorecardContext.Provider 
      value={{ 
        scorecardId, 
        setCurrentScorecard, 
        players, 
        setPlayers,
        clearScorecard 
      }}
    >
      {children}
    </ScorecardContext.Provider>
  );
}

export function useScorecard() {
  const context = useContext(ScorecardContext);
  if (context === undefined) {
    throw new Error('useScorecard must be used within a ScorecardProvider');
  }
  return context;
} 
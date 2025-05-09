import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { GolfGroup, Game } from '../types/game';

interface GroupContextType {
  selectedGroup: GolfGroup | null;
  setSelectedGroup: (group: GolfGroup | null) => void;
  games: Game[];
  setGames: (games: Game[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: GolfGroup[];
  setSearchResults: (results: GolfGroup[]) => void;
  clearGroup: () => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState<GolfGroup | null>(() => {
    const saved = localStorage.getItem('selectedGroup');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('groupGames');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GolfGroup[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(() => {
    const saved = localStorage.getItem('selectedGame');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem('selectedGroup', JSON.stringify(selectedGroup));
    } else {
      localStorage.removeItem('selectedGroup');
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem('groupGames', JSON.stringify(games));
    } else {
      localStorage.removeItem('groupGames');
    }
  }, [games]);

  useEffect(() => {
    if (selectedGame) {
      localStorage.setItem('selectedGame', JSON.stringify(selectedGame));
    } else {
      localStorage.removeItem('selectedGame');
    }
  }, [selectedGame]);

  const clearGroup = () => {
    setSelectedGroup(null);
    setGames([]);
    setSearchResults([]);
    setSearchTerm('');
    setSelectedGame(null);
    localStorage.removeItem('selectedGroup');
    localStorage.removeItem('groupGames');
    localStorage.removeItem('selectedGame');
  };

  return (
    <GroupContext.Provider value={{ 
      selectedGroup, 
      setSelectedGroup, 
      games, 
      setGames,
      searchTerm,
      setSearchTerm,
      searchResults,
      setSearchResults,
      clearGroup,
      selectedGame,
      setSelectedGame
    }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup(): GroupContextType {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
}
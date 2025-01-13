import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GolfGroup, Game } from '../types/game';

interface GroupContextType {
  selectedGroup: GolfGroup | null;
  setSelectedGroup: (group: GolfGroup | null) => void;
  games: Game[];
  setGames: (games: Game[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: GolfGroup[];
  setSearchResults: (groups: GolfGroup[]) => void;
  clearGroup: () => void;
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

  const clearGroup = () => {
    setSelectedGroup(null);
    setGames([]);
    setSearchResults([]);
    setSearchTerm('');
    localStorage.removeItem('selectedGroup');
    localStorage.removeItem('groupGames');
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
      clearGroup
    }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
}
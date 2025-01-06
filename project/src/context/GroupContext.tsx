import { createContext, useContext, useState, ReactNode } from 'react';
import { GolfGroup, Game } from '../types/api';

interface GroupContextType {
  selectedGroup: GolfGroup | null;
  setSelectedGroup: (group: GolfGroup | null) => void;
  games: Game[];
  setGames: (games: Game[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: GolfGroup[];
  setSearchResults: (groups: GolfGroup[]) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState<GolfGroup | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GolfGroup[]>([]);

  return (
    <GroupContext.Provider value={{ 
      selectedGroup, 
      setSelectedGroup, 
      games, 
      setGames,
      searchTerm,
      setSearchTerm,
      searchResults,
      setSearchResults
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
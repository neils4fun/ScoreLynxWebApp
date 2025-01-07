import { useState, useEffect } from 'react';
import { GroupList } from '../components/GroupList';
import { GameList } from '../components/GameList';
import { SearchField } from '../components/SearchField';
import { useDebounce } from '../hooks/useDebounce';
import { fetchGolfGroups, fetchGroupGames } from '../api/gameApi';
import { useGroup } from '../context/GroupContext';
import type { GolfGroup } from '../types/game';

export default function GamesScreen() {
  const { 
    selectedGroup, 
    setSelectedGroup, 
    games, 
    setGames,
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults
  } = useGroup();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    const searchGroups = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchGolfGroups(debouncedSearchTerm);
        setSearchResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      } finally {
        setIsLoading(false);
      }
    };

    searchGroups();
  }, [debouncedSearchTerm, setSearchResults]);

  const handleGroupSelect = async (group: GolfGroup) => {
    setIsLoading(true);
    setError(null);
    setSelectedGroup(group);
    
    try {
      const fetchedGames = await fetchGroupGames(group.groupID);
      setGames(fetchedGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedGroup(null);
    setGames([]);
  };

  return (
    <div className="p-4">
      {!selectedGroup && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Select Group</h1>
          <SearchField 
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </>
      )}
      
      {isLoading && (
        <p className="text-gray-600">Loading...</p>
      )}
      
      {error && (
        <p className="text-red-600">{error}</p>
      )}
      
      {!isLoading && !error && !selectedGroup && (
        <GroupList 
          groups={searchResults} 
          onGroupSelect={handleGroupSelect}
          selectedGroupId={undefined}
        />
      )}

      {!isLoading && !error && selectedGroup && (
        <GameList 
          games={games}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
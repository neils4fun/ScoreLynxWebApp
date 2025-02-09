import { useState, useEffect } from 'react';
import { fetchGolfGroups } from '../api/gameApi';
import { SearchField } from '../components/game/SearchField';
import { useDebounce } from '../hooks/useDebounce';
import type { GolfGroup } from '../types/game';

interface SelectGroupScreenProps {
  onGroupSelect: (group: GolfGroup) => void;
}

export function SelectGroupScreen({ onGroupSelect }: SelectGroupScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<GolfGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchGroups = async () => {
    if (!debouncedSearchTerm) {
      setGroups([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await fetchGolfGroups(debouncedSearchTerm);
      setGroups(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchGroups();
  }, [debouncedSearchTerm]);

  return (
    <div className="p-4">
      <div className="max-w-sm mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Select Group</h2>
        <SearchField
          value={searchTerm}
          onChange={(value: string) => setSearchTerm(value)}
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-4">Searching groups...</div>
        ) : groups.length === 0 ? (
          searchTerm ? (
            <div className="text-center py-4 text-gray-500">No groups found</div>
          ) : null
        ) : (
          <div className="space-y-1">
            {groups.map((group) => (
              <button
                key={group.groupID}
                onClick={() => onGroupSelect(group)}
                className="w-full px-3 py-2 bg-white rounded-md hover:bg-gray-50 transition-colors
                  flex items-center justify-between border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-900">
                  {group.groupName}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
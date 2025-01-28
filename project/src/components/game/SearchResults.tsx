import type { GolfGroup } from '../../types/game';
import { GroupCard } from './GroupCard';

interface SearchResultsProps {
  results: GolfGroup[];
  onSelect: (group: GolfGroup) => void;
  selectedGroupId?: string;
}

export function SearchResults({ results, onSelect, selectedGroupId }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No results found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="divide-y divide-gray-200">
        {results.map((group) => (
          <GroupCard
            key={group.groupID}
            group={group}
            isSelected={group.groupID === selectedGroupId}
            onClick={() => onSelect(group)}
          />
        ))}
      </div>
    </div>
  );
}
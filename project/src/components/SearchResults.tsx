import { GolfGroup } from '../types/game';
import { GroupCard } from './GroupCard';

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  searchResults: GolfGroup[];
}

export function SearchResults({ isLoading, error, searchResults }: SearchResultsProps) {
  if (isLoading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (searchResults.length === 0) {
    return <p className="text-center text-gray-500">Enter a search term to view results</p>;
  }

  return (
    <div className="space-y-4">
      {searchResults.map((group) => (
        <GroupCard key={group.groupID} group={group} />
      ))}
    </div>
  );
}
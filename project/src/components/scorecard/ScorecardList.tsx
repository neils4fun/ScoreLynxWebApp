import { ScorecardSummary } from '../../types/scorecard';

interface ScorecardListProps {
  scorecards: ScorecardSummary[];
  isLoading: boolean;
  error: string | null;
  onStartScoring: (scorecardId: string) => void;
}

export function ScorecardList({ scorecards, isLoading, error, onStartScoring }: ScorecardListProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading scorecards...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!scorecards || scorecards.length === 0) {
    return <div className="text-center py-8">No scorecards available</div>;
  }

  return (
    <div className="space-y-2">
      {scorecards.map((scorecard) => (
        <div 
          key={scorecard.scorecardID}
          className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onStartScoring(scorecard.scorecardID)}
        >
          <h3 className="font-medium text-gray-900">{scorecard.name}</h3>
        </div>
      ))}
    </div>
  );
}
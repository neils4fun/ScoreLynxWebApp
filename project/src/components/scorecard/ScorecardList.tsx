import { useState } from 'react';
import { ScorecardSummary } from '../../types/scorecard';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteScorecard } from '../../api/scorecardApi';
import { useGame } from '../../context/GameContext';

interface ScorecardListProps {
  scorecards: ScorecardSummary[];
  isLoading: boolean;
  error: string | null;
  onStartScoring: (scorecardId: string) => void;
  onRefresh: () => void;
  onEdit: (scorecardId: string, currentName: string) => void;
}

export function ScorecardList({ scorecards, isLoading, error, onStartScoring, onRefresh, onEdit }: ScorecardListProps) {
  const { selectedGame } = useGame();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  if (isLoading) {
    return <div className="text-center py-8">Loading scorecards...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!scorecards || scorecards.length === 0) {
    return <div className="text-center py-8">No scorecards available</div>;
  }

  const handleEdit = (e: React.MouseEvent, scorecardId: string, currentName: string) => {
    e.stopPropagation();
    onEdit(scorecardId, currentName);
  };

  const handleDelete = async (e: React.MouseEvent, scorecardId: string) => {
    e.stopPropagation();
    
    if (!selectedGame) return;
    
    setDeletingIds(prev => new Set(prev).add(scorecardId));
    
    try {
      await deleteScorecard(scorecardId, selectedGame.gameID);
      onRefresh(); // Refresh the list after successful deletion
    } catch (err) {
      console.error('Failed to delete scorecard:', err);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(scorecardId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-2">
      {scorecards.map((scorecard) => (
        <div 
          key={scorecard.scorecardID}
          className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onStartScoring(scorecard.scorecardID)}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">{scorecard.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleEdit(e, scorecard.scorecardID, scorecard.name)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={(e) => handleDelete(e, scorecard.scorecardID)}
                disabled={deletingIds.has(scorecard.scorecardID)}
                className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors
                  ${deletingIds.has(scorecard.scorecardID) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
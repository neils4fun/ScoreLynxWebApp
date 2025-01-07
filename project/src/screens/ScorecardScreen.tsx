import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { fetchScorecardList } from '../api/scorecardApi';
import { ScorecardList } from '../components/scorecard/ScorecardList';
import { ScorecardPlayerScreen } from './ScorecardPlayerScreen';
import type { ScorecardSummary } from '../types/scorecard';

export function ScorecardScreen() {
  const { selectedGame } = useGame();
  const [scorecards, setScorecards] = useState<ScorecardSummary[]>([]);
  const [selectedScorecard, setSelectedScorecard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScorecards() {
      if (!selectedGame?.gameID) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchScorecardList(selectedGame.gameID);
        setScorecards(data.scorecards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load scorecards');
      } finally {
        setIsLoading(false);
      }
    }

    loadScorecards();
  }, [selectedGame]);

  if (selectedScorecard) {
    return (
      <ScorecardPlayerScreen 
        gameId={selectedGame?.gameID || ''}
        scorecardId={selectedScorecard}
        onBack={() => setSelectedScorecard(null)}
      />
    );
  }

  if (!selectedGame) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Scorecards</h2>
          <p className="text-gray-600 mb-8">Select a game to view its scorecards</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scorecards</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="w-5 h-5 mr-2" />
          New Scorecard
        </button>
      </div>

      <ScorecardList 
        scorecards={scorecards}
        isLoading={isLoading}
        error={error}
        onStartScoring={setSelectedScorecard}
      />
    </div>
  );
}
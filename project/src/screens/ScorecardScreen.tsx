import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useScorecard } from '../context/ScorecardContext';
import { ScoringScreen } from './ScoringScreen';
import { ScorecardList } from '../components/scorecard/ScorecardList';
import { fetchScorecardList } from '../api/scorecardApi';
import type { ScorecardListResponse } from '../types/scorecard';

export function ScorecardScreen() {
  const { selectedGame } = useGame();
  const { scorecardId, setCurrentScorecard } = useScorecard();
  const [scorecards, setScorecards] = useState<ScorecardListResponse['scorecards']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScorecards() {
      if (!selectedGame) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchScorecardList(selectedGame.gameID);
        setScorecards(response.scorecards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load scorecards');
      } finally {
        setIsLoading(false);
      }
    }

    loadScorecards();
  }, [selectedGame]);

  // If we have both a selected game and scorecard, show the scoring screen
  if (selectedGame && scorecardId) {
    return (
      <ScoringScreen
        gameId={selectedGame.gameID}
        scorecardId={scorecardId}
        onBack={() => {
          setCurrentScorecard(null);  // Allow going back to scorecard list
        }}
      />
    );
  }

  // Otherwise show the scorecard list
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scorecards</h2>
        <button
          onClick={() => {/* TODO: Implement new scorecard creation */}}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Scorecard
        </button>
      </div>
      <ScorecardList
        scorecards={scorecards}
        isLoading={isLoading}
        error={error}
        onStartScoring={(scorecardId) => {
          setCurrentScorecard(scorecardId);
        }}
      />
    </div>
  );
}
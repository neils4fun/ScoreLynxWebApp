import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useScorecard } from '../context/ScorecardContext';
import { ScoringScreen } from './ScoringScreen';
import { ScorecardList } from '../components/scorecard/ScorecardList';
import { fetchScorecardList, fetchScorecardPlayerList } from '../api/scorecardApi';
import type { ScorecardListResponse } from '../types/scorecard';

export function ScorecardScreen() {
  const { selectedGame } = useGame();
  const { scorecardId, setCurrentScorecard, players, setPlayers } = useScorecard();
  const [scorecards, setScorecards] = useState<ScorecardListResponse['scorecards']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(false);

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

  useEffect(() => {
    async function loadPlayers() {
      if (!selectedGame || !scorecardId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchScorecardPlayerList(selectedGame.gameID, scorecardId);
        setPlayers(response.players);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load players');
      } finally {
        setIsLoading(false);
      }
    }

    if (scorecardId && !isScoring) {
      loadPlayers();
    }
  }, [selectedGame, scorecardId, isScoring]);

  // If we're in scoring mode and have both a selected game and scorecard, show the scoring screen
  if (isScoring && selectedGame && scorecardId) {
    return (
      <ScoringScreen
        gameId={selectedGame.gameID}
        scorecardId={scorecardId}
        onBack={() => {
          setIsScoring(false);  // Go back to scorecard details
        }}
      />
    );
  }

  // If we have a selected scorecard but aren't scoring, show the details view
  if (scorecardId && !isScoring) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Scorecard Players</h2>
          <button
            onClick={() => setCurrentScorecard(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading players...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Player
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Handicap
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tee
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gross
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {players.map((player) => {
                        const grossTotal = player.scores.reduce((sum, score) => sum + (score.grossScore || 0), 0);
                        const netTotal = player.scores.reduce((sum, score) => sum + (score.netScore || 0), 0);
                        
                        return (
                          <tr key={player.playerID}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {player.firstName} {player.lastName}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {player.handicap || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {player.tee?.name || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {grossTotal || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {netTotal || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsScoring(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Start Scoring
              </button>
            </div>
          </>
        )}
      </div>
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
        onStartScoring={(id) => {
          setCurrentScorecard(id);
        }}
      />
    </div>
  );
}
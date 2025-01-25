import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useScorecard } from '../context/ScorecardContext';
import { ScoringScreen } from './ScoringScreen';
import { ScorecardList } from '../components/scorecard/ScorecardList';
import { fetchScorecardList, fetchScorecardPlayerList, addScorecard } from '../api/scorecardApi';
import type { ScorecardListResponse } from '../types/scorecard';
import { ArrowLeft, RotateCw } from 'lucide-react';

export function ScorecardScreen() {
  const { selectedGame } = useGame();
  const { scorecardId, setCurrentScorecard, players, setPlayers } = useScorecard();
  const [scorecards, setScorecards] = useState<ScorecardListResponse['scorecards']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [isCreatingScorecard, setIsCreatingScorecard] = useState(false);
  const [newScorecardName, setNewScorecardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadScorecards = async () => {
    if (!selectedGame) return;

    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetchScorecardList(selectedGame.gameID);
      setScorecards(response.scorecards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scorecards');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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

  const handleCreateScorecard = async () => {
    if (!selectedGame) return;
    
    setIsCreating(true);
    setError(null);

    try {
      await addScorecard(newScorecardName, selectedGame.gameID);
      
      // Reset form state and return to list view
      setIsCreatingScorecard(false);
      setNewScorecardName('');
      
      // Refresh the scorecard list
      await loadScorecards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scorecard');
    } finally {
      setIsCreating(false);
    }
  };

  // If we're creating a new scorecard, show the creation form
  if (isCreatingScorecard) {
    return (
      <div className="p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => {
                setIsCreatingScorecard(false);
                setNewScorecardName('');
                setError(null);
              }}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">New Scorecard</h2>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="scorecardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Scorecard Name
                </label>
                <input
                  type="text"
                  id="scorecardName"
                  value={newScorecardName}
                  onChange={(e) => setNewScorecardName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter scorecard name"
                  disabled={isCreating}
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <button
                onClick={handleCreateScorecard}
                disabled={!newScorecardName.trim() || isCreating}
                className={`w-full px-4 py-2 text-white rounded-md font-medium
                  ${newScorecardName.trim() && !isCreating
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'}
                `}
              >
                {isCreating ? 'Creating...' : 'Create Scorecard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentScorecard(null)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Scorecard Players</h2>
            <div className="flex-1 flex justify-end">
              <button
                onClick={loadScorecards}
                disabled={isRefreshing}
                className={`p-2 hover:bg-gray-100 rounded-full
                  ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
                  transition-transform active:scale-95`}
              >
                <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
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
      </div>
    );
  }

  // Otherwise show the scorecard list
  return (
    <div className="p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Scorecards</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreatingScorecard(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              New Scorecard
            </button>
            <button
              onClick={loadScorecards}
              disabled={isRefreshing}
              className={`p-2 hover:bg-gray-100 rounded-full
                ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
                transition-transform active:scale-95`}
            >
              <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
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
    </div>
  );
}
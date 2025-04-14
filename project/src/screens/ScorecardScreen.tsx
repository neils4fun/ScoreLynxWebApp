import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useScorecard } from '../context/ScorecardContext';
import { ScoringScreen } from './ScoringScreen';
import { ScorecardList } from '../components/scorecard/ScorecardList';
import { fetchScorecardList, fetchScorecardPlayerList, addScorecard, updateScorecard } from '../api/scorecardApi';
import type { ScorecardListResponse } from '../types/scorecard';
import { ArrowLeft, RotateCw, Trash2 } from 'lucide-react';
import { ICONS } from '../api/config';
import type { Player } from '../types/player';
import { removeScorecardPlayer } from '../api/playerApi';
import { AddGroupPlayersScreen } from './AddGroupPlayersScreen';

export function ScorecardScreen() {
  const { selectedGame } = useGame();
  const { scorecardId, setCurrentScorecard, players, setPlayers } = useScorecard();
  const [scorecards, setScorecards] = useState<ScorecardListResponse['scorecards']>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(() => {
    const saved = localStorage.getItem('scorecardIsScoring');
    return saved === 'true';
  });
  const [isCreatingScorecard, setIsCreatingScorecard] = useState(false);
  const [isEditingScorecard, setIsEditingScorecard] = useState(false);
  const [editingScorecardId, setEditingScorecardId] = useState<string | null>(null);
  const [newScorecardName, setNewScorecardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingPlayers, setIsAddingPlayers] = useState(false);
  const [isDeletingPlayer, setIsDeletingPlayer] = useState(false);

  // Save scoring state to localStorage
  useEffect(() => {
    localStorage.setItem('scorecardIsScoring', isScoring.toString());
  }, [isScoring]);

  // Clear scoring state when scorecard changes
  useEffect(() => {
    if (!scorecardId) {
      setIsScoring(false);
      localStorage.removeItem('scorecardIsScoring');
    }
  }, [scorecardId]);

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

  const loadPlayers = async () => {
    if (!selectedGame || !scorecardId) return;

    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetchScorecardPlayerList(selectedGame.gameID, scorecardId);
      setPlayers(response.players);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to create scorecard';
      
      // Check if the error message indicates a name conflict
      if (errorMessage.toLowerCase().includes('name already exists') || 
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('already in use')) {
        setError('A scorecard with this name already exists. Please choose a different name.');
      } else {
        setError('Failed to create scorecard. Please try again.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateScorecard = async () => {
    if (!selectedGame || !editingScorecardId) return;
    
    setIsCreating(true);
    setError(null);

    try {
      await updateScorecard(editingScorecardId, selectedGame.gameID, newScorecardName);
      
      // Reset form state and return to list view
      setIsEditingScorecard(false);
      setEditingScorecardId(null);
      setNewScorecardName('');
      
      // Refresh the scorecard list
      await loadScorecards();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update scorecard';
      
      // Check if the error message indicates a name conflict
      if (errorMessage.toLowerCase().includes('name already exists') || 
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('already in use')) {
        setError('A scorecard with this name already exists. Please choose a different name.');
      } else {
        setError('Failed to update scorecard. Please try again.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartEdit = (scorecardId: string, currentName: string) => {
    setEditingScorecardId(scorecardId);
    setNewScorecardName(currentName);
    setIsEditingScorecard(true);
    setError(null);
  };

  const handleAddPlayers = async (newPlayers: Player[]) => {
    if (newPlayers.length === 0 || !selectedGame || !scorecardId) return;

    setError(null);

    try {
      // Players are already added in the AddGroupPlayersScreen component
      // Just return to the scorecard view and refresh the player list
      setIsAddingPlayers(false);
      await loadPlayers();
    } catch (err) {
      console.error('Error refreshing players:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh players');
    }
  };

  const handleBack = () => {
    setIsAddingPlayers(false);
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!scorecardId || isDeletingPlayer || !selectedGame) return;

    setIsDeletingPlayer(true);
    setError(null);

    try {
      await removeScorecardPlayer(scorecardId, playerId, selectedGame.gameID);
      await loadPlayers(); // Refresh the list after successful deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove player');
    } finally {
      setIsDeletingPlayer(false);
    }
  };

  // Make sure this condition comes FIRST, before any other view conditions
  if (isAddingPlayers && selectedGame && scorecardId) {
    return (
      <AddGroupPlayersScreen
        onBack={handleBack}
        onAddPlayers={handleAddPlayers}
        gameId={selectedGame.gameID}
        groupId={selectedGame.groupID}
        scorecardId={scorecardId}
      />
    );
  }

  // If we're in scoring mode and have both a selected game and scorecard, show the scoring screen
  if (isScoring && selectedGame && scorecardId) {
    return (
      <ScoringScreen
        gameId={selectedGame.gameID}
        scorecardId={scorecardId}
        onBack={() => setIsScoring(false)}
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
              <img 
                src={ICONS.ADD_USERS}
                alt="Add Multiple Players"
                onClick={() => {
                  setIsAddingPlayers(true);
                }}
                className="w-6 h-6 mr-2 cursor-pointer"
              />
              <button
                onClick={loadPlayers}
                disabled={isRefreshing}
                className={`p-2 hover:bg-gray-100 rounded-full
                  ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
                  transition-transform active:scale-95`}
              >
                <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {isRefreshing ? (
            <div className="text-center py-4">Loading players...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="divide-y divide-gray-200">
                  {players.map((player) => (
                    <div
                      key={player.playerID}
                      className="flex items-center justify-between p-4"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {player.firstName} {player.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Handicap: {player.handicap || 'N/A'} • {player.tee?.name || 'No Tee'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePlayer(player.playerID)}
                        disabled={isDeletingPlayer}
                        className={`p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100
                          ${isDeletingPlayer ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <button
                  onClick={() => setIsScoring(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
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

  // If we're editing a scorecard, show the edit form
  if (isEditingScorecard) {
    return (
      <div className="p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => {
                setIsEditingScorecard(false);
                setEditingScorecardId(null);
                setNewScorecardName('');
                setError(null);
              }}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Update Scorecard</h2>
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
                onClick={handleUpdateScorecard}
                disabled={!newScorecardName.trim() || isCreating}
                className={`w-full px-4 py-2 text-white rounded-md font-medium
                  ${newScorecardName.trim() && !isCreating
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'}
                `}
              >
                {isCreating ? 'Updating...' : 'Update Scorecard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          isLoading={isRefreshing}
          error={error}
          onStartScoring={(id) => {
            setCurrentScorecard(id);
          }}
          onRefresh={loadScorecards}
          onEdit={handleStartEdit}
        />
      </div>
    </div>
  );
}
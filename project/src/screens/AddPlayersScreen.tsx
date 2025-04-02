import { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { getGamePlayerExScorecardList } from '../api/scorecardApi';
import { addScorecardPlayer } from '../api/playerApi';
import type { Player } from '../types/player';

interface AddPlayersScreenProps {
  gameId: string;
  scorecardId: string;
  onBack: () => void;
  onAddPlayers: (players: Player[]) => void;
}

export function AddPlayersScreen({ gameId, scorecardId, onBack, onAddPlayers }: AddPlayersScreenProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadPlayers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getGamePlayerExScorecardList(gameId);
        setPlayers(response.players);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load players');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayers();
  }, [gameId]);

  const togglePlayer = (playerId: string) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
  };

  const handleAddPlayers = async () => {
    if (selectedPlayers.size === 0) return;

    setIsAdding(true);
    setError(null);

    try {
      const selectedPlayersList = players.filter(player => 
        selectedPlayers.has(player.playerID)
      );

      // Add players one by one
      const addPromises = Array.from(selectedPlayers).map(playerId =>
        addScorecardPlayer(gameId, scorecardId, playerId)
      );

      await Promise.all(addPromises);

      // Call onAddPlayers with the selected players
      onAddPlayers(selectedPlayersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add players');
      // Don't call onAddPlayers if there was an error
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Add Players</h2>
        </div>

        {isLoading ? (
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
                    onClick={() => togglePlayer(player.playerID)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {player.firstName} {player.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Handicap: {player.handicap || 'N/A'} • {player.tee?.name || 'No Tee'}
                      </div>
                    </div>
                    {selectedPlayers.has(player.playerID) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddPlayers}
              disabled={selectedPlayers.size === 0 || isAdding}
              className={`w-full px-4 py-3 rounded-md font-medium
                ${selectedPlayers.size > 0 && !isAdding
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              {isAdding ? 'Adding Players...' : 'Add Selected Players'}
            </button>
          </>
        )}
      </div>
    </div>
  );
} 
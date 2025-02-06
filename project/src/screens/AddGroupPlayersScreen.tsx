import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Check } from 'lucide-react';
import { fetchGroupPlayerList, addGamePlayerByName } from '../api/playerApi';
import type { Player } from '../types/player';

interface AddGroupPlayersScreenProps {
  onBack: () => void;
  onAddPlayers: (players: Player[]) => void;
  gameId: string;
  groupId: string;
}

export function AddGroupPlayersScreen({ onBack, onAddPlayers, gameId, groupId }: AddGroupPlayersScreenProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingPlayers, setIsAddingPlayers] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchGroupPlayerList(gameId);
      setPlayers(response.players);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [gameId]);

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds(prev => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        next.add(playerId);
      }
      return next;
    });
  };

  const handleAddPlayers = async () => {
    const selectedPlayers = players.filter(player => selectedPlayerIds.has(player.playerID));
    if (selectedPlayers.length === 0) return;

    setIsAddingPlayers(true);
    setError(null);

    try {
      // Add each selected player to the game
      const addPlayerPromises = selectedPlayers.map(async player => {
        const handicapValue = player.handicap ? parseInt(player.handicap) : null;
        const teeId = player.tee?.teeID || '';

        return await addGamePlayerByName({
          gameID: gameId,
          groupID: groupId,
          firstName: player.firstName,
          lastName: player.lastName,
          handicap: handicapValue,
          teeID: teeId,
          didPay: parseInt(player.didPay) || 0,
          venmoName: player.venmoName,
        });
      });

      // Wait for all players to be added
      await Promise.all(addPlayerPromises);
      
      // Call onAddPlayers with the selected players to trigger refresh
      onAddPlayers(selectedPlayers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add players');
      setIsAddingPlayers(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading players...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 ml-4">Add Players</h2>
        <button
          onClick={loadData}
          disabled={isLoading}
          className={`p-2 hover:bg-gray-100 rounded-full ml-auto
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            transition-transform active:scale-95`}
        >
          <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2 mb-6">
        {players.map((player) => (
          <div
            key={player.playerID}
            onClick={() => togglePlayer(player.playerID)}
            className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow
              flex items-center justify-between border border-gray-200 cursor-pointer relative"
          >
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">
                {player.firstName} {player.lastName} ({player.handicap || 'N/A'})
              </span>
            </div>
            {selectedPlayerIds.has(player.playerID) && (
              <Check className="w-5 h-5 text-green-600" />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPlayers}
        disabled={selectedPlayerIds.size === 0 || isAddingPlayers}
        className={`w-full py-3 px-4 rounded-md font-medium
          ${selectedPlayerIds.size > 0 && !isAddingPlayers
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        {isAddingPlayers ? 'Adding Players...' : 'Add Selected Players'}
      </button>
    </div>
  );
} 

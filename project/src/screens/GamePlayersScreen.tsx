import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { fetchGamePlayerList } from '../api/playerApi';
import type { Game } from '../types/game';
import type { Player } from '../types/player';

interface GamePlayersScreenProps {
  game: Game;
  onBack: () => void;
}

export function GamePlayersScreen({ game, onBack }: GamePlayersScreenProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPlayers = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetchGamePlayerList(game.gameID);
      setPlayers(response.players);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadPlayers().finally(() => setIsLoading(false));
  }, [game.gameID]);

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
          <h2 className="text-2xl font-bold text-gray-900">Players</h2>
          <div className="flex-1 flex justify-end">
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

        {isLoading ? (
          <div className="text-center py-4">Loading players...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
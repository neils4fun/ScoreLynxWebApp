import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { fetchTeamPlayerList } from '../api/teamApi';
import type { Player } from '../types/player';

interface TeamPlayerListScreenProps {
  onBack: () => void;
  onEditPlayer: (player: Player) => void;
  teamId: string;
  teamName: string;
}

export function TeamPlayerListScreen({ onBack, onEditPlayer, teamId, teamName }: TeamPlayerListScreenProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchTeamPlayerList(teamId);
      setPlayers(response.players);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team players');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teamId]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading team players...</div>;
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
        <h2 className="text-2xl font-bold text-gray-900 ml-4">{teamName} Players</h2>
        <button
          onClick={loadData}
          disabled={isLoading}
          className={`p-2 hover:bg-gray-100 rounded-full ml-24
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            transition-transform active:scale-95`}
        >
          <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {players.map((player) => (
          <button
            key={player.playerID}
            onClick={() => onEditPlayer(player)}
            className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow
              flex items-center justify-between border border-gray-200"
          >
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium text-gray-900">
                {player.firstName} {player.lastName}
              </span>
              <span className="text-sm text-gray-500">
                {player.tee?.name} ({player.tee?.rating}/{player.tee?.slope})
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-medium text-gray-900">
                {player.handicap}
              </span>
              <span className="text-sm text-gray-500">
                Handicap
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 

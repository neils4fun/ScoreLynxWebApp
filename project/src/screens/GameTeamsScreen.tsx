import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Users } from 'lucide-react';
import { fetchTeamList } from '../api/teamApi';
import type { Game } from '../types/game';
import type { Team } from '../types/team';

interface GameTeamsScreenProps {
  game: Game;
  onBack: () => void;
}

export function GameTeamsScreen({ game, onBack }: GameTeamsScreenProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTeams = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetchTeamList(game.gameID);
      setTeams(response.teams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadTeams().finally(() => setIsLoading(false));
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
          <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={loadTeams}
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
          <div className="text-center py-4">Loading teams...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-200">
              {teams.map((team) => (
                <div
                  key={team.teamID}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {team.teamName}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {team.numPlayers} Players
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
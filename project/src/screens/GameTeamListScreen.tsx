import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { fetchTeamList } from '../api/teamApi';
import type { Team } from '../types/team';
import type { Player } from '../types/player';
import { TeamPlayerListScreen } from './TeamPlayerListScreen';

interface GameTeamListScreenProps {
  onBack: () => void;
  onEditPlayer: (player: Player) => void;
  gameId: string;
}

export function GameTeamListScreen({ onBack, onEditPlayer, gameId }: GameTeamListScreenProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchTeamList(gameId);
      setTeams(response.teams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [gameId]);

  if (selectedTeam) {
    return (
      <TeamPlayerListScreen
        teamId={selectedTeam.teamID}
        teamName={selectedTeam.teamName}
        onBack={() => setSelectedTeam(null)}
        onEditPlayer={onEditPlayer}
      />
    );
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading teams...</div>;
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
        <h2 className="text-2xl font-bold text-gray-900 ml-4">Teams</h2>
        <div className="flex-1 flex justify-end">
          <button
            onClick={loadData}
            disabled={isLoading}
            className={`p-2 hover:bg-gray-100 rounded-full
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              transition-transform active:scale-95`}
          >
            <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {teams.map((team) => (
          <button
            key={team.teamID}
            onClick={() => setSelectedTeam(team)}
            className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow
              flex items-center justify-between border border-gray-200"
          >
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium text-gray-900">
                {team.teamName}
              </span>
              <span className="text-sm text-gray-500">
                {team.numPlayers} Players
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Trash2 } from 'lucide-react';
import { fetchTeamList, deleteTeam } from '../api/teamApi';
import type { Team } from '../types/team';
import type { Game } from '../types/game';
import { TeamPlayerListScreen } from './TeamPlayerListScreen';
import { AddTeamScreen } from './AddTeamScreen';

interface GameTeamListScreenProps {
  onBack: () => void;
  gameId: string;
  game: Game;
}

export function GameTeamListScreen({ onBack, gameId, game }: GameTeamListScreenProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isDeletingTeam, setIsDeletingTeam] = useState(false);

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

  const handleDeleteTeam = async (teamId: string) => {
    if (isDeletingTeam) return;

    setIsDeletingTeam(true);
    setError(null);

    try {
      await deleteTeam(teamId);
      await loadData(); // Refresh the list after successful deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team');
    } finally {
      setIsDeletingTeam(false);
    }
  };

  if (isAddingTeam) {
    return (
      <AddTeamScreen
        gameId={gameId}
        onBack={() => setIsAddingTeam(false)}
        onSuccess={() => {
          setIsAddingTeam(false);
          loadData();
        }}
      />
    );
  }

  if (selectedTeam) {
    return (
      <TeamPlayerListScreen
        teamId={selectedTeam.teamID}
        onBack={() => setSelectedTeam(null)}
        game={game}
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
        <div className="flex-1 flex justify-end space-x-2">
          <button
            onClick={() => setIsAddingTeam(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Team
          </button>
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
          <div
            key={team.teamID}
            className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow
              flex items-center justify-between border border-gray-200"
          >
            <button
              onClick={() => setSelectedTeam(team)}
              className="flex-1 text-left"
            >
              <span className="text-lg font-medium text-gray-900">
                {team.teamName}
              </span>
            </button>
            <button
              onClick={() => handleDeleteTeam(team.teamID)}
              disabled={isDeletingTeam}
              className={`p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100
                ${isDeletingTeam ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 

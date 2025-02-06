import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Pencil, Trash2 } from 'lucide-react';
import { fetchTeamPlayerList, deleteTeamPlayer } from '../api/teamApi';
import { fetchTeesForCourse } from '../api/playerApi';
import type { Player } from '../types/player';
import type { Game } from '../types/game';
import type { Tee } from '../types/player';
import { EditPlayerScreen } from './EditPlayerScreen';
import { AddGroupPlayersScreen } from './AddGroupPlayersScreen';
import { ICONS } from '../api/config';
import { useGroup } from '../context/GroupContext';

interface TeamPlayerListScreenProps {
  teamId: string;
  onBack: () => void;
  game: Game;
}

export function TeamPlayerListScreen({ teamId, onBack, game }: TeamPlayerListScreenProps) {
  const { selectedGroup } = useGroup();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isAddingGroupPlayers, setIsAddingGroupPlayers] = useState(false);
  const [isAddingSinglePlayer, setIsAddingSinglePlayer] = useState(false);
  const [defaultTee, setDefaultTee] = useState<Tee | null>(null);
  const [deletingPlayerIds, setDeletingPlayerIds] = useState<Set<string>>(new Set());

  const loadPlayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTeamPlayerList(teamId);
      setPlayers(response.players);
    } catch (err) {
      setError('Failed to load players');
      console.error('Error loading players:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTees = async () => {
    try {
      const response = await fetchTeesForCourse(game.courseID);
      const gameTee = response.tees.find(tee => tee.name === game.teeName);
      if (gameTee) {
        setDefaultTee(gameTee);
      }
    } catch (err) {
      console.error('Failed to load tees:', err);
    }
  };

  useEffect(() => {
    loadPlayers();
    loadTees();
  }, [teamId]);

  const handleDeletePlayer = async (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation();
    setDeletingPlayerIds(prev => new Set(prev).add(playerId));
    setError(null);

    try {
      await deleteTeamPlayer(teamId, playerId);
      await loadPlayers();
    } catch (err) {
      setError('Failed to delete player');
      console.error('Error deleting player:', err);
    } finally {
      setDeletingPlayerIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }
  };

  if (selectedPlayer) {
    return (
      <EditPlayerScreen
        player={selectedPlayer}
        game={game}
        groupId={game.groupID}
        onBack={() => setSelectedPlayer(null)}
        onSave={async () => {
          setSelectedPlayer(null);
          await loadPlayers();
        }}
      />
    );
  }

  if (isAddingSinglePlayer) {
    return (
      <EditPlayerScreen
        isNewPlayer
        defaultTee={defaultTee}
        game={game}
        groupId={game.groupID}
        teamId={teamId}
        onBack={() => setIsAddingSinglePlayer(false)}
        onSave={() => {
          setIsAddingSinglePlayer(false);
          loadPlayers();
        }}
      />
    );
  }

  if (isAddingGroupPlayers && selectedGroup) {
    return (
      <AddGroupPlayersScreen
        gameId={game.gameID}
        groupId={selectedGroup.groupID}
        teamId={teamId}
        onBack={() => setIsAddingGroupPlayers(false)}
        onAddPlayers={() => {
          setIsAddingGroupPlayers(false);
          loadPlayers();
        }}
      />
    );
  }

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
          <div className="flex-1 flex justify-end items-center space-x-2">
            <img 
              src={ICONS.ADD_USERS}
              alt="Add Multiple Players"
              onClick={() => setIsAddingGroupPlayers(true)}
              className="w-6 h-6 cursor-pointer"
            />
            <img 
              src={ICONS.ADD_USER}
              alt="Add Single Player"
              onClick={() => setIsAddingSinglePlayer(true)}
              className="w-6 h-6 cursor-pointer"
            />
            <button
              onClick={loadPlayers}
              disabled={isLoading}
              className={`p-2 hover:bg-gray-100 rounded-full
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                transition-transform active:scale-95`}
            >
              <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-4">Loading players...</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-200">
              {players.map((player) => (
                <div
                  key={player.playerID}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {player.firstName} {player.lastName} ({player.handicap || 'N/A'})
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.tee?.name || 'No Tee'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPlayer(player)}
                      className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePlayer(e, player.playerID)}
                      disabled={deletingPlayerIds.has(player.playerID)}
                      className={`p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600
                        ${deletingPlayerIds.has(player.playerID) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Pencil, Trash2 } from 'lucide-react';
import { fetchGamePlayerList, deleteGamePlayer, fetchTeesForCourse } from '../api/playerApi';
import { EditPlayerScreen } from './EditPlayerScreen';
import { AddGroupPlayersScreen } from './AddGroupPlayersScreen';
import { useGroup } from '../context/GroupContext';
import type { Game } from '../types/game';
import type { Player, Tee } from '../types/player';
import { ICONS } from '../api/config';

interface GamePlayersScreenProps {
  game: Game;
  onBack: () => void;
}

export function GamePlayersScreen({ game, onBack }: GamePlayersScreenProps) {
  const { selectedGroup } = useGroup();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isAddingGroupPlayers, setIsAddingGroupPlayers] = useState(false);
  const [isAddingSinglePlayer, setIsAddingSinglePlayer] = useState(false);
  const [deletingPlayerIds, setDeletingPlayerIds] = useState<Set<string>>(new Set());
  const [defaultTee, setDefaultTee] = useState<Tee | null>(null);

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
    loadTees();
  }, [game.courseID, game.teeName]);

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

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handlePlayerSave = async (updatedPlayer: Player) => {
    setPlayers(players.map(p => 
      p.playerID === updatedPlayer.playerID ? updatedPlayer : p
    ));
    setSelectedPlayer(null);
    setIsAddingSinglePlayer(false);
    await loadPlayers();
  };

  const handleAddPlayers = () => {
    setIsAddingGroupPlayers(false);
    loadPlayers();
  };

  const handleDeletePlayer = async (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation();
    
    setDeletingPlayerIds(prev => new Set(prev).add(playerId));
    setError(null);

    try {
      await deleteGamePlayer(playerId, game.gameID);
      await loadPlayers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete player');
    } finally {
      setDeletingPlayerIds(prev => {
        const next = new Set(prev);
        next.delete(playerId);
        return next;
      });
    }
  };

  const handleAddSinglePlayer = () => {
    setIsAddingSinglePlayer(true);
  };

  if (isAddingGroupPlayers && selectedGroup) {
    return (
      <AddGroupPlayersScreen
        gameId={game.gameID}
        groupId={game.groupID}
        onBack={() => setIsAddingGroupPlayers(false)}
        onAddPlayers={handleAddPlayers}
      />
    );
  }

  if ((selectedPlayer || isAddingSinglePlayer) && selectedGroup) {
    return (
      <EditPlayerScreen
        player={isAddingSinglePlayer ? undefined : selectedPlayer || undefined}
        game={game}
        groupId={selectedGroup.groupID}
        onBack={() => {
          setSelectedPlayer(null);
          setIsAddingSinglePlayer(false);
        }}
        onSave={handlePlayerSave}
        defaultTee={defaultTee}
        isNewPlayer={isAddingSinglePlayer}
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
          <h2 className="text-2xl font-bold text-gray-900">Players</h2>
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
              onClick={handleAddSinglePlayer}
              className="w-6 h-6 cursor-pointer"
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
                    onClick={() => handlePlayerSelect(player)}
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
                      onClick={() => handlePlayerSelect(player)}
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
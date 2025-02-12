import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Pencil, Trash2 } from 'lucide-react';
import { fetchGroupGames } from '../api/gameApi';
import { GameCard } from '../components/game/GameCard';
import { WeatherIcon } from '../components/game/WeatherIcon';
import type { GolfGroup, Game } from '../types/game';

interface GroupGamesScreenProps {
  group: GolfGroup;
  onBack: () => void;
  onGameSelect: (game: Game) => void;
  onCreateGame: () => void;
  onEditGame?: (game: Game) => void;
}

export function GroupGamesScreen({ 
  group, 
  onBack, 
  onGameSelect,
  onCreateGame,
  onEditGame 
}: GroupGamesScreenProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingGameIds, setDeletingGameIds] = useState<Set<string>>(new Set());

  const loadGames = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchGroupGames(group.groupID);
      setGames(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, [group.groupID]);

  const handleEditGame = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    if (onEditGame) {
      onEditGame(game);
    }
  };

  const handleDeleteGame = async (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    setDeletingGameIds(prev => new Set(prev).add(game.gameID));
    
    try {
      // TODO: Implement delete functionality
      console.log('Delete game:', game.gameID);
      await new Promise(resolve => setTimeout(resolve, 500)); // Temporary delay to show loading state
    } finally {
      setDeletingGameIds(prev => {
        const next = new Set(prev);
        next.delete(game.gameID);
        return next;
      });
    }
  };

  const isGameEligibleForWeather = (game: Game) => {
    // Parse date from gameKey (YYYYMMDD format)
    const year = parseInt(game.gameKey.substring(0, 4));
    const month = parseInt(game.gameKey.substring(4, 6)) - 1; // Months are 0-based
    const day = parseInt(game.gameKey.substring(6, 8));
    
    const gameDate = new Date(year, month, day);
    const today = new Date();
    
    // Reset time portion for date comparison
    gameDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return gameDate >= today;
  };

  return (
    <div className="p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 ml-4">{group.groupName}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCreateGame}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Game
            </button>
            <button
              onClick={loadGames}
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
          <div className="text-center py-4">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No games found</div>
        ) : (
          <div className="space-y-2">
            {games.map((game) => (
              <div 
                key={game.gameID} 
                className="flex items-center space-x-2"
              >
                <div 
                  onClick={() => onGameSelect(game)}
                  className="flex-1 cursor-pointer"
                >
                  <GameCard
                    game={game}
                    isSelected={false}
                  />
                </div>
                <div className="flex flex-col space-y-1 py-2">
                  <button
                    onClick={(e) => handleEditGame(e, game)}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600
                      bg-white shadow-sm transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteGame(e, game)}
                    disabled={deletingGameIds.has(game.gameID)}
                    className={`p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600
                      bg-white shadow-sm transition-colors
                      ${deletingGameIds.has(game.gameID) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isGameEligibleForWeather(game) && (
                    <WeatherIcon
                      city="Charlotte"
                      state="NC"
                      date={new Date(
                        parseInt(game.gameKey.substring(0, 4)),
                        parseInt(game.gameKey.substring(4, 6)) - 1,
                        parseInt(game.gameKey.substring(6, 8))
                      )}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
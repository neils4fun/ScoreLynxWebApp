import { Game } from '../types/game';
import { GameCard } from './GameCard';
import { useGame } from '../context/GameContext';

interface GameListProps {
  games: Game[];
  onBack: () => void;
}

export function GameList({ games, onBack }: GameListProps) {
  const { selectedGame } = useGame();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Games</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Groups
        </button>
      </div>

      {games.length === 0 ? (
        <p className="text-gray-500">No games found for this group.</p>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <GameCard 
              key={game.gameID} 
              game={game} 
              isSelected={selectedGame?.gameID === game.gameID}
            />
          ))}
        </div>
      )}
    </div>
  );
}
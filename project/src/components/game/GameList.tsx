import { ArrowLeft } from 'lucide-react';
import { GameCard } from './GameCard';
import type { Game } from '../../types/game';
import { useGroup } from '../../context/GroupContext';

interface GameListProps {
  games: Game[];
  onBack: () => void;
}

export function GameList({ games, onBack }: GameListProps) {
  const { selectedGame } = useGroup();

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Games</h2>
      </div>

      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.gameID}>
            <GameCard 
              game={game} 
              isSelected={selectedGame?.gameID === game.gameID}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
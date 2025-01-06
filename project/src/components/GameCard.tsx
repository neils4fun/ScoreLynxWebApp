import { Game } from '../types/api';
import { formatGameDate } from '../utils/dateUtils';
import { useGame } from '../context/GameContext';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { setSelectedGame } = useGame();

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedGame(game)}
    >
      <div className="flex flex-col space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{game.gameKey} ({game.round})</span>
          <span className="text-sm text-gray-600">{formatGameDate(game.gameKey)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-900 font-medium">{game.gameType}</span>
          <span className="text-sm text-gray-600 text-right">{game.skinType}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{game.courseName}</span>
          <span className="text-sm text-gray-600">{game.teeName} tees</span>
        </div>
      </div>
    </div>
  );
}
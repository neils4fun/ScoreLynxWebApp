import type { Game } from '../../types/game';
import { formatGameDate } from '../../utils/dateUtils';
import { useGroup } from '../../context/GroupContext';

interface GameCardProps {
  game: Game;
  isSelected?: boolean;
}

export function GameCard({ game, isSelected }: GameCardProps) {
  const { setSelectedGame } = useGroup();

  return (
    <div 
      className={`rounded-lg border p-3 transition-all cursor-pointer
        ${isSelected 
          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
          : 'bg-white border-gray-200 hover:shadow-md'}`}
      onClick={() => setSelectedGame(game)}
    >
      <div className="flex flex-col space-y-1.5">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
            {game.gameKey} ({game.round})
          </span>
          <span className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
            {formatGameDate(game.gameKey)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {game.gameType}
          </span>
          <span className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-600'} text-right`}>
            {game.skinType}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
            {game.courseName}
          </span>
          <span className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
            {game.teeName} tees
          </span>
        </div>
      </div>
    </div>
  );
}
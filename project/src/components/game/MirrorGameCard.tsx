import type { MirrorableGame } from '../../api/gameApi';

interface MirrorGameCardProps {
  game: MirrorableGame;
  onClick: () => void;
}

export function MirrorGameCard({ game, onClick }: MirrorGameCardProps) {
  // Format the date from gameKey (YYYYMMDD)
  const formatDate = (gameKey: string) => {
    const year = gameKey.substring(0, 4);
    const month = gameKey.substring(4, 6);
    const day = gameKey.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="rounded-lg border p-3 transition-all cursor-pointer
        bg-white border-gray-200 hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex flex-col space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">
            {game.gameKey}({game.round || '1'})
          </span>
          <span className="text-sm text-gray-600">
            {formatDate(game.gameKey)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">
            {game.gameType}
          </span>
          <span className="text-sm text-gray-600">
            {game.skinsType || 'No Skins'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">
            {game.courseName}
          </span>
          <span className="text-sm text-gray-600">
            {game.teeName} tees
          </span>
        </div>
      </div>
    </div>
  );
} 
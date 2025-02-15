import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { fetchMirrorableGames, type MirrorableGame } from '../../api/gameApi';
import { MirrorGameCard } from './MirrorGameCard';

interface MirrorGameSelectorProps {
  onBack: () => void;
  onSelect: (gameId: string, gameName: string) => void;
  groupId: string;
  gameKey: string;
}

export function MirrorGameSelector({ onBack, onSelect, groupId, gameKey }: MirrorGameSelectorProps) {
  const [games, setGames] = useState<MirrorableGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMirrorableGames = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mirrorableGames = await fetchMirrorableGames(groupId, gameKey);
      setGames(mirrorableGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mirrorable games');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMirrorableGames();
  }, [groupId, gameKey]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md mx-auto h-[90vh] flex flex-col rounded-t-xl">
        <div className="bg-white p-4 border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold ml-2">Select Mirror Game</h2>
            <div className="flex-1 flex justify-end">
              <button
                onClick={loadMirrorableGames}
                disabled={isLoading}
                className={`p-2 hover:bg-gray-100 rounded-full
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  transition-transform active:scale-95`}
              >
                <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center">Loading mirrorable games...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : games.length === 0 ? (
            <div className="text-center text-gray-500">No mirrorable games available</div>
          ) : (
            <div className="space-y-2">
              {games.map((game) => (
                <MirrorGameCard
                  key={game.gameID}
                  game={game}
                  onClick={() => onSelect(game.gameID, `${game.gameType} - ${game.courseName} (${game.teeName})`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
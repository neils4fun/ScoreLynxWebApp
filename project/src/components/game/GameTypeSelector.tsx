import { useState, useEffect } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { fetchGameMetaList } from '../../api/gameApi';
import type { GameMeta } from '../../types/gameMeta';

interface GameTypeSelectorProps {
  onBack: () => void;
  onSelect: (gameType: GameMeta) => void;
}

export function GameTypeSelector({ onBack, onSelect }: GameTypeSelectorProps) {
  const [gameTypes, setGameTypes] = useState<GameMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState<string | null>(null);

  useEffect(() => {
    const loadGameTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchGameMetaList();
        setGameTypes(response.gameMetaList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game types');
      } finally {
        setIsLoading(false);
      }
    };

    loadGameTypes();
  }, []);

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
            <h2 className="text-xl font-bold ml-2">Select Game Type</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">Loading game types...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {gameTypes.map((gameType) => (
                <div key={gameType.type} className="bg-white">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => onSelect(gameType)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{gameType.type}</div>
                      <div className="text-sm text-gray-500">
                        {gameType.teamPlayerType} Game
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDescription(
                          showDescription === gameType.type ? null : gameType.type
                        );
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Info className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  {showDescription === gameType.type && (
                    <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 whitespace-pre-wrap">
                      {gameType.description.replace(/<br>/g, '\n')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fetchSkinsDetail, type SkinPlayer } from '../api/leaderboardApi';

interface SkinsDetailScreenProps {
  gameId: string;
  holeNumber: number;
  skinsType: 'Net' | 'Gross';
  onBack: () => void;
}

export function SkinsDetailScreen({ gameId, holeNumber, skinsType, onBack }: SkinsDetailScreenProps) {
  const [players, setPlayers] = useState<SkinPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSkinsDetail() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchSkinsDetail({
          gameID: gameId,
          gameHole: holeNumber,
          skinsType
        });
        setPlayers(response.skins);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skins detail');
      } finally {
        setIsLoading(false);
      }
    }

    loadSkinsDetail();
  }, [gameId, holeNumber, skinsType]);

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-2 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          Hole {holeNumber} {skinsType} Skins
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading skins detail...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {skinsType === 'Net' ? 'Net' : 'Score'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player.playerID}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {player.firstName} {player.lastName}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                    {player.gross}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                    {player.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
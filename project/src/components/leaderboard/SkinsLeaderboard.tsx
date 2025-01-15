import { Skin } from '../../types/leaderboard';

interface SkinsLeaderboardProps {
  skins: Skin[];
  isLoading: boolean;
  error: string | null;
  gameType: string;
  onSkinSelect?: (holeNumber: number, type: 'Net' | 'Gross') => void;
}

export function SkinsLeaderboard({ skins, isLoading, error, gameType, onSkinSelect }: SkinsLeaderboardProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading skins data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!skins || skins.length === 0) {
    return <div className="text-center py-8">No skins data available</div>;
  }

  return (
    <div className="-mx-4 sm:mx-0">
      {gameType && (
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
          {gameType}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hole</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {skins.map((skin) => (
              <tr 
                key={`${skin.holeNumber}-${skin.type}`}
                onClick={() => onSkinSelect?.(skin.holeNumber, skin.type as 'Net' | 'Gross')}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-2 py-2 text-sm text-gray-900">{skin.holeNumber}</td>
                <td className="px-2 py-2 text-sm text-gray-900">
                  {skin.playerID === -1 ? 'Cut' : `${skin.firstName} ${skin.lastName}`.trim()}
                </td>
                <td className="px-2 py-2 text-sm text-center font-medium text-blue-600">{skin.score}</td>
                <td className="px-2 py-2 text-sm text-center">{skin.gross}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
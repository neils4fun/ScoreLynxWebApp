import type { Skin } from '../../types/leaderboard';

interface SkinsLeaderboardProps {
  skins: Skin[];
  isLoading: boolean;
  error: string | null;
  onSkinSelect: (holeNumber: number, type: 'Net' | 'Gross') => void;
}

export function SkinsLeaderboard({ 
  skins, 
  isLoading, 
  error, 
  onSkinSelect 
}: SkinsLeaderboardProps) {
  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!skins.length) {
    return <p className="text-gray-600 text-center">No skins data available</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="min-w-[500px]">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hole
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {skins.map((skin, index) => (
              <tr 
                key={`${skin.holeNumber}-${skin.type}-${index}`}
                onClick={() => onSkinSelect(skin.holeNumber, skin.type)}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-gray-100`}
              >
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {skin.holeNumber}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {`${skin.firstName} ${skin.lastName}`}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {skin.type}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                  {skin.type === 'Net' ? skin.score : skin.gross}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
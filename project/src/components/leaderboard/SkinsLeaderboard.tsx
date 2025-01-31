import type { Skin } from '../../types/leaderboard';

interface SkinsLeaderboardProps {
  skins: Skin[][];
  gameTypes: string[];
  isLoading: boolean;
  error: string | null;
  onSkinSelect: (holeNumber: number, type: 'Net' | 'Gross') => void;
}

export function SkinsLeaderboard({ 
  skins, 
  gameTypes,
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

  if (!skins || !Array.isArray(skins) || skins.length === 0 || !skins[0]?.length) {
    return <p className="text-gray-600 text-center">No skins data available</p>;
  }

  return (
    <div className="w-full space-y-8">
      {skins.map((skinGroup, groupIndex) => (
        <div key={groupIndex} className="w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {gameTypes?.[groupIndex] || `Skins ${groupIndex + 1}`}
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Hole
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Player
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {skinGroup.map((skin, index) => (
                    <tr 
                      key={`${skin.holeNumber}-${skin.type}-${index}-${groupIndex}`}
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
        </div>
      ))}
    </div>
  );
}
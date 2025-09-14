import type { JunkLeader } from '../../types/leaderboard';

interface JunkLeaderboardProps {
  leaders: JunkLeader[][];
  headers: string[][];
  gameTypes: string[];
  isLoading: boolean;
  error: string | null;
}

export function JunkLeaderboard({ leaders, headers, gameTypes, isLoading, error }: JunkLeaderboardProps) {
  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!leaders || !Array.isArray(leaders) || leaders.length === 0 || !leaders[0]?.length) {
    return <p className="text-gray-600 text-center">No junk leaderboard data available</p>;
  }

  return (
    <div className="space-y-6">
      {leaders.map((leaderGroup, groupIndex) => (
        <div key={groupIndex} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {gameTypes[groupIndex] || `Game Type ${groupIndex + 1}`}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers[groupIndex] && [
                    // Reorder headers to match the new column order: Player, Junks, Payout, Thru
                    <th key={0} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      {headers[groupIndex][0]} {/* Player */}
                    </th>,
                    <th key={1} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      {headers[groupIndex][1]} {/* Junks */}
                    </th>,
                    <th key={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      {headers[groupIndex][3]} {/* Payout */}
                    </th>,
                    <th key={3} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      {headers[groupIndex][2]} {/* Thru */}
                    </th>
                  ]}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderGroup.map((leader, leaderIndex) => (
                  <tr key={leaderIndex} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                      {leader.playerName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center w-1/6">
                      {leader.junkCount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center w-1/4">
                      {leader.payout}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center w-1/6">
                      {leader.thruHole}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

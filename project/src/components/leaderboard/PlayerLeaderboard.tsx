import type { PlayerLeader } from '../../types/leaderboard';

interface PlayerLeaderboardProps {
  leaders: PlayerLeader[];
  headers: string[][];
  isLoading: boolean;
  error: string | null;
}

export function PlayerLeaderboard({ leaders, headers, isLoading, error }: PlayerLeaderboardProps) {
  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!leaders.length) {
    return <p className="text-gray-600 text-center">No leaderboard data available</p>;
  }

  const columnHeaders = headers[0] || ['Player', 'Gross', 'Net', 'Total', 'Thru'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pos
            </th>
            {columnHeaders.map((header, index) => (
              <th 
                key={header}
                className={`px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  index === 0 ? 'text-left' : 'text-right'
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leaders.map((leader, index) => (
            <tr key={leader.playerID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                {leader.place}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                {leader.playerName}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                {leader.grossScore}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                {leader.absoluteScore}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                {leader.relativeScore}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                {leader.thruHole}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
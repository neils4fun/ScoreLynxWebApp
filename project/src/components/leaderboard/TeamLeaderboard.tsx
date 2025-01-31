import { TeamLeader } from '../../types/leaderboard';

interface TeamLeaderboardProps {
  leaders: TeamLeader[][];
  headers: string[][];
  gameTypes: string[];
  isLoading: boolean;
  error: string | null;
}

export function TeamLeaderboard({ leaders, headers, gameTypes, isLoading, error }: TeamLeaderboardProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading team data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!leaders || !Array.isArray(leaders) || leaders.length === 0 || !leaders[0]?.length) {
    return <div className="text-center py-8">No team data available</div>;
  }

  return (
    <div className="w-full space-y-8">
      {leaders.map((leaderGroup, groupIndex) => (
        <div key={groupIndex} className="w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {gameTypes?.[groupIndex] || `Leaderboard ${groupIndex + 1}`}
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {(headers?.[groupIndex] || ['Team', 'Net', 'Total', 'Thru']).map((header, index) => (
                      <th 
                        key={header}
                        className={`px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                          index === 0 ? 'text-left' : 'text-center'
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderGroup.map((team, index) => (
                    <tr key={`${team.teamID}-${groupIndex}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                        {team.teamName}
                      </td>
                      <td className="px-4 py-2 text-sm text-center font-medium text-blue-600 whitespace-nowrap">
                        {team.relativeScore > 0 ? `+${team.relativeScore}` : team.relativeScore}
                      </td>
                      <td className="px-4 py-2 text-sm text-center whitespace-nowrap">
                        {team.absoluteScore}
                      </td>
                      <td className="px-4 py-2 text-sm text-center whitespace-nowrap">
                        {team.holesPlayed}
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
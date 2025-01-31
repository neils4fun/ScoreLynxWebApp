import { TeamLeader } from '../../types/leaderboard';

interface TeamLeaderboardProps {
  leaders: TeamLeader[];
  isLoading: boolean;
  error: string | null;
  gameType?: string;
}

export function TeamLeaderboard({ leaders, isLoading, error, gameType }: TeamLeaderboardProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading team data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!leaders || leaders.length === 0) {
    return <div className="text-center py-8">No team data available</div>;
  }

  return (
    <div className="w-full">
      {gameType && (
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
          {gameType}
        </h3>
      )}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thru</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaders.map((team, index) => (
                <tr key={team.teamID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">{team.teamName}</td>
                  <td className="px-4 py-2 text-sm text-center font-medium text-blue-600 whitespace-nowrap">
                    {team.relativeScore > 0 ? `+${team.relativeScore}` : team.relativeScore}
                  </td>
                  <td className="px-4 py-2 text-sm text-center whitespace-nowrap">{team.absoluteScore}</td>
                  <td className="px-4 py-2 text-sm text-center whitespace-nowrap">{team.holesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
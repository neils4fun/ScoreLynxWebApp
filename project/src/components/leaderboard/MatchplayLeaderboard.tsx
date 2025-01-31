import { MatchplayLeader } from '../../types/leaderboard';

interface MatchplayLeaderboardProps {
  leaders: MatchplayLeader[];
  isLoading: boolean;
  error: string | null;
  gameType?: string;
}

export function MatchplayLeaderboard({ leaders, isLoading, error, gameType }: MatchplayLeaderboardProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading matchplay data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!leaders || leaders.length === 0) {
    return <div className="text-center py-8">No matchplay data available</div>;
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Away</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thru</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaders.map((match, index) => (
                <tr key={`${match.matchID}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">{match.homeTeamName}</td>
                  <td className="px-4 py-2 text-sm text-center font-medium text-blue-600 whitespace-nowrap">
                    {match.matchplayScore}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">{match.awayTeamName}</td>
                  <td className="px-4 py-2 text-sm text-center whitespace-nowrap">{match.holesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
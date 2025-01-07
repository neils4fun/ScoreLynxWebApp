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
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">Home</th>
              <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Score</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">Away</th>
              <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Thru</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaders.map((match, index) => (
              <tr key={`${match.matchID}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 text-xs text-gray-900">
                  <div className="truncate max-w-[120px]" title={match.homeTeamName}>
                    {match.homeTeamName}
                  </div>
                </td>
                <td className="px-1 py-2 text-xs text-center font-medium text-blue-600 whitespace-nowrap">
                  {match.matchplayScore}
                </td>
                <td className="px-2 py-2 text-xs text-gray-900">
                  <div className="truncate max-w-[120px]" title={match.awayTeamName}>
                    {match.awayTeamName}
                  </div>
                </td>
                <td className="px-1 py-2 text-xs text-center text-gray-500 whitespace-nowrap">
                  {match.holesPlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
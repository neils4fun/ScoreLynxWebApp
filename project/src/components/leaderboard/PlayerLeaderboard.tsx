import { PlayerLeader } from '../../types/api';

interface PlayerLeaderboardProps {
  leaders: PlayerLeader[];
  isLoading: boolean;
  error: string | null;
  gameType?: string;
}

export function PlayerLeaderboard({ leaders, isLoading, error, gameType }: PlayerLeaderboardProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading player data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!leaders || leaders.length === 0) {
    return <div className="text-center py-8">No player data available</div>;
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
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thru</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaders.map((player, index) => (
              <tr key={player.playerID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 text-sm text-gray-900">
                  <div className="flex flex-col">
                    <span>{player.playerName}</span>
                    <span className="text-xs text-gray-500">HC: {player.handicap}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-sm text-center">{player.grossScore}</td>
                <td className="px-2 py-2 text-sm text-center">{player.relativeScore}</td>
                <td className="px-2 py-2 text-sm text-center">{player.holesPlayed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
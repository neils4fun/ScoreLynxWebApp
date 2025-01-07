import { Payout } from '../../types/leaderboard';

interface PayoutsLeaderboardProps {
  payouts: Payout[];
  isLoading: boolean;
  error: string | null;
  gameType?: string;
}

export function PayoutsLeaderboard({ payouts, isLoading, error, gameType }: PayoutsLeaderboardProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading payouts data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!payouts || payouts.length === 0) {
    return <div className="text-center py-8">No payouts data available</div>;
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
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Skins</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payouts.map((payout, index) => (
              <tr 
                key={payout.payoutID || index} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                  ${payout.payoutName === 'Total' ? 'font-semibold bg-gray-50' : ''}`}
              >
                <td className="px-2 py-2 text-sm text-gray-900">{payout.payoutName}</td>
                <td className="px-2 py-2 text-sm text-center">
                  {payout.gamePayout > 0 ? `$${payout.gamePayout}` : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-center">
                  {payout.skinsPayout > 0 ? `$${payout.skinsPayout}` : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-center font-medium text-blue-600">
                  {payout.totalPayout > 0 ? `$${payout.totalPayout}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import type { Payout } from '../../types/leaderboard';

interface PayoutsLeaderboardProps {
  payouts: Payout[];
  headers: string[][];
  isLoading: boolean;
  error: string | null;
}

export function PayoutsLeaderboard({ 
  payouts, 
  headers,
  isLoading, 
  error 
}: PayoutsLeaderboardProps) {
  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!payouts.length) {
    return <p className="text-gray-600 text-center">No payouts data available</p>;
  }

  const columnHeaders = headers[0] || ['Player', 'Game', 'Skins', 'Total'];

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
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
          {payouts.map((payout, index) => (
            <tr 
              key={payout.payoutID || index}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                payout.payoutName === 'Total' ? 'font-bold' : ''
              }`}
            >
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                {payout.payoutName}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                {formatCurrency(payout.gamePayout)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                {formatCurrency(payout.skinsPayout)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                {formatCurrency(payout.totalPayout)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
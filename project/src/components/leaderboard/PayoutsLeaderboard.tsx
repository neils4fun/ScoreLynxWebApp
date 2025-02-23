import { useState } from 'react';
import type { Payout } from '../../types/leaderboard';

interface PayoutsLeaderboardProps {
  payouts: Payout[][];
  headers: string[][];
  gameTypes: string[];
  isLoading: boolean;
  error: string | null;
}

export function PayoutsLeaderboard({ 
  payouts, 
  headers,
  gameTypes,
  isLoading, 
  error 
}: PayoutsLeaderboardProps) {
  const [showContributionAlert, setShowContributionAlert] = useState(false);

  const handleRowClick = (payoutName: string) => {
    if (payoutName === "** TAP ME **") {
      setShowContributionAlert(true);
    }
  };

  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!payouts || !Array.isArray(payouts) || payouts.length === 0 || !payouts[0]?.length) {
    return <p className="text-gray-600 text-center">No payouts data available</p>;
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="w-full space-y-8">
      {showContributionAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contribution</h3>
            <p className="text-gray-600 mb-4">
              Thank you for using ScoreLynxPro, please consider contributing to help support ongoing maintenance and improvements. A suggested amount is 2% of the total payout pot your group is playing for. If you'd like to contribute please Venmo this amount or any amount you choose to, @scorelynx
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowContributionAlert(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {payouts.map((payoutGroup, groupIndex) => (
        <div key={groupIndex} className="w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {gameTypes?.[groupIndex] || `Payouts ${groupIndex + 1}`}
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {(headers?.[groupIndex] || ['Player', 'Game', 'Skins', 'Total']).map((header, index) => (
                      <th 
                        key={header}
                        className={`px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                          index === 0 ? 'text-left' : 'text-right'
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payoutGroup.map((payout, index) => (
                    <tr 
                      key={`${payout.payoutID || index}-${groupIndex}`}
                      onClick={() => handleRowClick(payout.payoutName)}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                        payout.payoutName === 'Total' ? 'font-bold' : ''
                      } ${payout.payoutName === "** TAP ME **" ? 'cursor-pointer hover:bg-gray-100' : ''}`}
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
          </div>
        </div>
      ))}
    </div>
  );
}
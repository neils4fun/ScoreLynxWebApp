import { ArrowLeft } from 'lucide-react';
import type { GroupPlayerDetailHistoryResponse } from '../../api/reportsApi';
import { format, parse } from 'date-fns';

interface GroupPlayerDetailHistoryViewProps {
  report: GroupPlayerDetailHistoryResponse;
  onBack: () => void;
}

export function GroupPlayerDetailHistoryView({ report, onBack }: GroupPlayerDetailHistoryViewProps) {
  // Format the date from YYYYMMDD to a more readable format
  const formatDate = (dateString: string) => {
    try {
      // Parse the date string in YYYYMMDD format
      const date = parse(dateString, 'yyyyMMdd', new Date());
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      console.error('Error parsing date:', e);
      return dateString;
    }
  };

  return (
    <div className="max-w-full mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold ml-4">Player Detail History</h1>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-x-auto p-4">
        {report.results.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No game history found for this player</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handicap</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Double Eagles</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eagles</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birdies</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pars</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bogeys</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Double Bogeys</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.results.map((game, index) => (
                  <tr key={`${game.gameKey}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(game.gameKey)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{`${game.First} ${game.Last}`}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.handicap}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.gross}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.place}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.doubleEagles}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.eagles}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.birdies}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.pars}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.bogeys}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.doubleBogeys}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{game.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
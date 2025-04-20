import { ArrowLeft } from 'lucide-react';
import type { GroupPlayerDetailHistoryResponse } from '../../api/reportsApi';

interface GroupPlayerDetailHistoryViewProps {
  report: GroupPlayerDetailHistoryResponse;
  onBack: () => void;
}

export function GroupPlayerDetailHistoryView({ report, onBack }: GroupPlayerDetailHistoryViewProps) {
  // Format date from YYYYMMDD to MM/DD/YYYY
  const formatDate = (dateStr: string) => {
    if (dateStr.length === 8) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${month}/${day}/${year}`;
    }
    return dateStr;
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
          <h1 className="text-xl font-bold ml-4">Group Player Detail History</h1>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="bg-white rounded-lg shadow p-4 h-full">
          <div className="relative overflow-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="sticky top-0 z-20 bg-gray-50">
                <tr>
                  <th scope="col" className="sticky left-0 z-30 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="sticky left-[100px] z-30 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handicap
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eagles
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birdies
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pars
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bogeys
                  </th>
                  <th scope="col" className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Double+
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.results.map((game, index) => (
                  <tr key={`${game.gameKey}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(game.gameKey)}
                    </td>
                    <td className="sticky left-[100px] z-10 bg-inherit px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {game.First} {game.Last}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {game.handicap}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {game.gross}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {game.place}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {parseInt(game.eagles) + parseInt(game.doubleEagles)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {game.birdies}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {game.pars}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {game.bogeys}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {parseInt(game.doubleBogeys) + parseInt(game.others)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
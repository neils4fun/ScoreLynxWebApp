import { ArrowLeft } from 'lucide-react';
import type { TeeSheetReportResponse, TeeSheetScorecard, TeeSheetPlayer } from '../../api/reportsApi';

interface TeeSheetReportViewProps {
  report: TeeSheetReportResponse;
  onBack: () => void;
}

export function TeeSheetReportView({ report, onBack }: TeeSheetReportViewProps) {
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold ml-4">Tee Sheet Report</h1>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Game Info */}
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              <p>Course: {report.courseName}</p>
              <p>Tee: {report.teeName}</p>
              <p>Game Type: {report.gameType}</p>
              <p>Skin Type: {report.skinType}</p>
            </div>
          </div>

          {/* Scorecards */}
          {report.scorecards.map((scorecard: TeeSheetScorecard, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-md font-semibold mb-2">{scorecard.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Handicap</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tee</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scorecard.players.map((player: TeeSheetPlayer) => (
                      <tr key={player.playerID}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {player.firstName} {player.lastName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {player.handicap}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {player.tee.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
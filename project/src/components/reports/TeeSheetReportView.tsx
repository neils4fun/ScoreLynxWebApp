import { ArrowLeft, Download } from 'lucide-react';
import type { TeeSheetReportResponse, TeeSheetScorecard, TeeSheetPlayer } from '../../api/reportsApi';

interface TeeSheetReportViewProps {
  report: TeeSheetReportResponse;
  onBack: () => void;
}

export function TeeSheetReportView({ report, onBack }: TeeSheetReportViewProps) {
  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = `Course,${report.courseName}\n`;
    csvContent += `Tee,${report.teeName}\n`;
    csvContent += `Game,${report.gameType}\n`;
    csvContent += `Skins,${report.skinType}\n\n`;
    
    // Add header row for scorecards
    csvContent += 'Scorecard,';
    
    // Find the maximum number of players in any scorecard
    const maxPlayers = Math.max(...report.scorecards.map(sc => sc.players.length));
    
    // Add player headers (Player 1, Handicap 1, Tee 1, etc.)
    for (let i = 0; i < maxPlayers; i++) {
      csvContent += `Player ${i+1},Handicap ${i+1},Tee ${i+1}${i < maxPlayers - 1 ? ',' : ''}`;
    }
    csvContent += '\n';
    
    // Add each scorecard as a row
    report.scorecards.forEach(scorecard => {
      csvContent += `${scorecard.name},`;
      
      // Add player data
      for (let i = 0; i < maxPlayers; i++) {
        if (i < scorecard.players.length) {
          const player = scorecard.players[i];
          csvContent += `${player.firstName} ${player.lastName},${player.handicap},${player.tee.name}`;
        } else {
          csvContent += ',,';
        }
        
        if (i < maxPlayers - 1) {
          csvContent += ',';
        }
      }
      
      csvContent += '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tee_sheet_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">Tee Sheet Report</h1>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
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
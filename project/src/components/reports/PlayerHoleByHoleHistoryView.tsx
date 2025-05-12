import React from 'react';
import { PlayerHoleByHoleHistoryResponse } from '../../api/reportsApi';
import { ArrowLeft } from 'lucide-react';

interface PlayerHoleByHoleHistoryViewProps {
  report: PlayerHoleByHoleHistoryResponse;
  onBack: () => void;
}

const PlayerHoleByHoleHistoryView: React.FC<PlayerHoleByHoleHistoryViewProps> = ({ report, onBack }) => {
  // Group data by course and player name
  const groupedData: Record<string, {
    firstName: string;
    lastName: string;
    rounds: string;
    holes: Record<number, number>;
  }> = {};

  // Helper function to format rounds text
  const formatRoundsText = (rounds: string) => {
    const numRounds = parseInt(rounds);
    return numRounds === 1 ? '1 round' : `${numRounds} rounds`;
  };

  // Process the data to group by course and player name
  report.results.forEach(result => {
    const key = `${result.course}-${result.firstName}-${result.lastName}`;
    
    if (!groupedData[key]) {
      groupedData[key] = {
        firstName: result.firstName,
        lastName: result.lastName,
        rounds: result.rounds,
        holes: {}
      };
    }
    
    // Add hole data
    const holeNumber = parseInt(result.hole);
    if (!isNaN(holeNumber) && result.average) {
      groupedData[key].holes[holeNumber] = parseFloat(result.average);
    }
  });

  // Get unique course-player combinations
  const coursePlayerKeys = Object.keys(groupedData);
  
  // Generate hole numbers for the table
  const holeNumbers = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full mr-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Player Hole by Hole History</h2>
      </div>

      {coursePlayerKeys.map(key => {
        const data = groupedData[key];
        const [courseName] = key.split('-');
        
        return (
          <div key={key} className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {courseName} - {data.firstName} {data.lastName} ({formatRoundsText(data.rounds)})
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hole
                    </th>
                    {holeNumbers.map(holeNumber => (
                      <th 
                        key={holeNumber}
                        className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {holeNumber}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Score
                    </td>
                    {holeNumbers.map(holeNumber => (
                      <td 
                        key={holeNumber}
                        className="px-4 py-2 text-center text-sm text-gray-900"
                      >
                        {data.holes[holeNumber] !== undefined 
                          ? data.holes[holeNumber].toFixed(1) 
                          : '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerHoleByHoleHistoryView; 
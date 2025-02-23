import { useState } from 'react';
import type { TeamLeader } from '../../types/leaderboard';
import { TeamScorecardScreen } from '../../screens/TeamScorecardScreen';
import { useGame } from '../../context/GameContext';

interface TeamLeaderboardProps {
  leaders: TeamLeader[][];
  headers: string[][];
  gameTypes: string[];
  isLoading: boolean;
  error: string | null;
}

export function TeamLeaderboard({ leaders, headers, gameTypes, isLoading, error }: TeamLeaderboardProps) {
  const { selectedGame } = useGame();
  const [selectedTeam, setSelectedTeam] = useState<{
    teamId: string;
    teamName: string;
  } | null>(null);

  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!leaders || !Array.isArray(leaders) || leaders.length === 0 || !leaders[0]?.length) {
    return <p className="text-gray-600 text-center">No team data available</p>;
  }

  if (selectedTeam && selectedGame) {
    return (
      <TeamScorecardScreen
        gameId={selectedGame.gameID}
        teamId={selectedTeam.teamId}
        courseId={selectedGame.courseID}
        teamName={selectedTeam.teamName}
        onBack={() => setSelectedTeam(null)}
      />
    );
  }

  return (
    <div className="w-full space-y-8">
      {leaders.map((leaderGroup, groupIndex) => (
        <div key={groupIndex} className="w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {gameTypes?.[groupIndex] || `Leaderboard ${groupIndex + 1}`}
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {(headers?.[groupIndex] || ['Team', 'Score', 'Count', 'Thru']).map((header, index) => (
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
                  {leaderGroup.map((team, index) => (
                    <tr 
                      key={`${team.teamID}-${groupIndex}`} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-gray-100`}
                      onClick={() => setSelectedTeam({
                        teamId: team.teamID,
                        teamName: team.teamName
                      })}
                    >
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                        {team.teamName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                        {team.absoluteScore}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                        {team.relativeScore}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                        {team.holesPlayed}
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
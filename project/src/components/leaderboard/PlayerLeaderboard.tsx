import { useState } from 'react';
import type { PlayerLeader } from '../../types/leaderboard';
import { PlayerScorecardScreen } from '../../screens/PlayerScorecardScreen';
import { useGame } from '../../context/GameContext';

interface PlayerLeaderboardProps {
  leaders: PlayerLeader[][];
  headers: string[][];
  gameTypes: string[];
  isLoading: boolean;
  error: string | null;
}

export function PlayerLeaderboard({ leaders, headers, gameTypes, isLoading, error }: PlayerLeaderboardProps) {
  const { selectedGame } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<{
    playerId: string;
    playerName: string;
  } | null>(null);

  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!leaders || !Array.isArray(leaders) || leaders.length === 0 || !leaders[0]?.length) {
    return <p className="text-gray-600 text-center">No leaderboard data available</p>;
  }

  if (selectedPlayer && selectedGame) {
    return (
      <PlayerScorecardScreen
        gameId={selectedGame.gameID}
        playerId={selectedPlayer.playerId}
        courseId={selectedGame.courseID}
        playerName={selectedPlayer.playerName}
        onBack={() => setSelectedPlayer(null)}
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
                    {(headers?.[groupIndex] || ['Player', 'Gross', 'Net', 'Total', 'Thru']).map((header, index) => (
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
                  {leaderGroup.map((leader, index) => (
                    <tr 
                      key={`${leader.playerID}-${groupIndex}`} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-gray-100`}
                      onClick={() => setSelectedPlayer({
                        playerId: leader.playerID,
                        playerName: leader.playerName
                      })}
                    >
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                        {leader.playerName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                        {leader.grossScore}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                        {leader.absoluteScore}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                        {leader.relativeScore}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap text-right">
                        {leader.thruHole}
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
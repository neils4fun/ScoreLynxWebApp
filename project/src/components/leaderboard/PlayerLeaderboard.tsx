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
  const [showContributionAlert, setShowContributionAlert] = useState(false);

  const handlePlayerSelect = (playerId: string, playerName: string) => {
    if (playerName === "** TAP ME **") {
      setShowContributionAlert(true);
    } else {
      setSelectedPlayer({ playerId, playerName });
    }
  };

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

      {leaders.map((leaderGroup, groupIndex) => (
        <div key={groupIndex} className="w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {gameTypes?.[groupIndex] || `Leaderboard ${groupIndex + 1}`}
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    {(headers?.[groupIndex] || ['Player', 'Gross', 'Net', 'Total', 'Thru']).map((header, index) => (
                      <th 
                        key={header}
                        className={`${
                          index === 0 
                            ? 'w-[120px] text-left' 
                            : 'w-[60px] text-right'
                        } px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}
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
                      onClick={() => handlePlayerSelect(leader.playerID, leader.playerName)}
                    >
                      <td className="px-2 py-2 text-sm text-gray-900">
                        <div className="truncate" title={leader.playerName}>
                          {leader.playerName}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-900 text-right">
                        {leader.grossScore}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-900 text-right">
                        {leader.absoluteScore}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-900 text-right">
                        {leader.relativeScore}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-900 text-right">
                        {leader.holesPlayed}
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
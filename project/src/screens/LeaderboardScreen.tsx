import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { fetchMatchplayLeaderboard } from '../api/golfApi';
import { MatchplayLeaderboard } from '../components/leaderboard/MatchplayLeaderboard';
import type { MatchplayLeader } from '../types/api';

export function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState('team');
  const { selectedGame } = useGame();
  const [matchplayData, setMatchplayData] = useState<MatchplayLeader[]>([]);
  const [gameType, setGameType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getLeaderboardTabs = () => {
    const isMatchplay = selectedGame?.teamPlayerType === 'Matchplay';
    return [
      { id: 'team', label: isMatchplay ? 'Matchplay' : 'Team' },
      { id: 'player', label: 'Player' },
      { id: 'skins', label: 'Skins' },
      { id: 'payouts', label: 'Payouts' },
    ];
  };

  useEffect(() => {
    async function loadMatchplayData() {
      if (!selectedGame?.gameID || selectedGame?.teamPlayerType !== 'Matchplay') {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMatchplayLeaderboard(selectedGame.gameID);
        const flattenedData = data.leaders.flat();
        setMatchplayData(flattenedData);
        setGameType(data.gameTypes[0] || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load matchplay data');
      } finally {
        setIsLoading(false);
      }
    }

    loadMatchplayData();
  }, [selectedGame]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Leaderboard</h2>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-between">
          {getLeaderboardTabs().map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-2 border-b-2 font-medium text-xs sm:text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {!selectedGame ? (
          <p className="text-gray-600 text-center">Select a game to view leaderboard</p>
        ) : (
          activeTab === 'team' && selectedGame.teamPlayerType === 'Matchplay' ? (
            <MatchplayLeaderboard 
              leaders={matchplayData}
              isLoading={isLoading}
              error={error}
              gameType={gameType}
            />
          ) : (
            <p className="text-gray-600 text-center">Loading leaderboard data...</p>
          )
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { fetchMatchplayLeaderboard, fetchPlayerLeaderboard, fetchTeamLeaderboard, fetchSkins } from '../api/golfApi';
import { MatchplayLeaderboard } from '../components/leaderboard/MatchplayLeaderboard';
import { PlayerLeaderboard } from '../components/leaderboard/PlayerLeaderboard';
import { TeamLeaderboard } from '../components/leaderboard/TeamLeaderboard';
import { SkinsLeaderboard } from '../components/leaderboard/SkinsLeaderboard';
import type { MatchplayLeader, PlayerLeader, TeamLeader, Skin } from '../types/api';

export function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState('team');
  const { selectedGame } = useGame();
  const [matchplayData, setMatchplayData] = useState<MatchplayLeader[]>([]);
  const [playerData, setPlayerData] = useState<PlayerLeader[]>([]);
  const [teamData, setTeamData] = useState<TeamLeader[]>([]);
  const [skinsData, setSkinsData] = useState<Skin[]>([]);
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
    async function loadLeaderboardData() {
      if (!selectedGame?.gameID) return;

      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === 'team') {
          if (selectedGame.teamPlayerType === 'Matchplay') {
            const data = await fetchMatchplayLeaderboard(selectedGame.gameID);
            setMatchplayData(data.leaders.flat());
            setGameType(data.gameTypes[0] || '');
          } else {
            const data = await fetchTeamLeaderboard(selectedGame.gameID);
            setTeamData(data.leaders.flat());
            setGameType(data.gameTypes[0] || '');
          }
        } else if (activeTab === 'player') {
          const data = await fetchPlayerLeaderboard(selectedGame.gameID);
          setPlayerData(data.leaders.flat());
          setGameType(data.gameTypes[0] || '');
        } else if (activeTab === 'skins') {
          const data = await fetchSkins(selectedGame.gameID);
          setSkinsData(data.skins.flat());
          setGameType(data.gameTypes[0] || '');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboardData();
  }, [selectedGame, activeTab]);

  const renderLeaderboard = () => {
    if (!selectedGame) {
      return <p className="text-gray-600 text-center">Select a game to view leaderboard</p>;
    }

    if (activeTab === 'team') {
      if (selectedGame.teamPlayerType === 'Matchplay') {
        return (
          <MatchplayLeaderboard 
            leaders={matchplayData}
            isLoading={isLoading}
            error={error}
            gameType={gameType}
          />
        );
      }
      return (
        <TeamLeaderboard 
          leaders={teamData}
          isLoading={isLoading}
          error={error}
          gameType={gameType}
        />
      );
    }

    if (activeTab === 'player') {
      return (
        <PlayerLeaderboard 
          leaders={playerData}
          isLoading={isLoading}
          error={error}
          gameType={gameType}
        />
      );
    }

    if (activeTab === 'skins') {
      return (
        <SkinsLeaderboard 
          skins={skinsData}
          isLoading={isLoading}
          error={error}
          gameType={gameType}
        />
      );
    }

    return <p className="text-gray-600 text-center">This leaderboard type is not yet implemented</p>;
  };

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
        {renderLeaderboard()}
      </div>
    </div>
  );
}
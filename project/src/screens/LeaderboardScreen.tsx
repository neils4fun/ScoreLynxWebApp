import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { MatchplayLeaderboard } from '../components/leaderboard/MatchplayLeaderboard';
import { TeamLeaderboard } from '../components/leaderboard/TeamLeaderboard';
import { PlayerLeaderboard } from '../components/leaderboard/PlayerLeaderboard';
import { SkinsLeaderboard } from '../components/leaderboard/SkinsLeaderboard';
import { PayoutsLeaderboard } from '../components/leaderboard/PayoutsLeaderboard';
import { SkinsDetailScreen } from './SkinsDetailScreen';
import type { 
  MatchplayLeader,
  PlayerLeader,
  TeamLeader,
  Skin,
  Payout
} from '../types/leaderboard';
import { 
  fetchMatchplayLeaderboard,
  fetchTeamLeaderboard,
  fetchPlayerLeaderboard,
  fetchSkins,
  fetchPayouts
} from '../api/leaderboardApi';

interface SelectedSkin {
  holeNumber: number;
  type: 'Net' | 'Gross';
}

export default function LeaderboardScreen() {
  const { selectedGame } = useGame();
  const [activeTab, setActiveTab] = useState('team');
  const [selectedSkin, setSelectedSkin] = useState<SelectedSkin | null>(null);
  const [matchplayData, setMatchplayData] = useState<MatchplayLeader[]>([]);
  const [playerData, setPlayerData] = useState<PlayerLeader[]>([]);
  const [teamData, setTeamData] = useState<TeamLeader[]>([]);
  const [skinsData, setSkinsData] = useState<Skin[]>([]);
  const [payoutsData, setPayoutsData] = useState<Payout[]>([]);
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
    const abortController = new AbortController();

    async function loadLeaderboardData() {
      if (!selectedGame?.gameID) return;

      setIsLoading(true);
      setError(null);

      try {
        const signal = abortController.signal;

        if (activeTab === 'team') {
          if (selectedGame.teamPlayerType === 'Matchplay') {
            const data = await fetchMatchplayLeaderboard(selectedGame.gameID);
            if (!signal.aborted) {
              setMatchplayData(data.leaders.flat());
            }
          } else {
            const data = await fetchTeamLeaderboard(selectedGame.gameID);
            if (!signal.aborted) {
              setTeamData(data.leaders.flat());
            }
          }
        } else if (activeTab === 'player') {
          const data = await fetchPlayerLeaderboard(selectedGame.gameID);
          if (!signal.aborted) {
            setPlayerData(data.leaders.flat());
          }
        } else if (activeTab === 'skins') {
          const data = await fetchSkins(selectedGame.gameID);
          if (!signal.aborted) {
            setSkinsData(data.skins.flat());
          }
        } else if (activeTab === 'payouts') {
          const data = await fetchPayouts(selectedGame.gameID);
          if (!signal.aborted) {
            setPayoutsData(data.payouts.flat());
          }
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load leaderboard data');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadLeaderboardData();

    return () => {
      abortController.abort();
    };
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
          />
        );
      }
      return (
        <TeamLeaderboard 
          leaders={teamData}
          isLoading={isLoading}
          error={error}
        />
      );
    }

    if (activeTab === 'player') {
      return (
        <PlayerLeaderboard 
          leaders={playerData}
          isLoading={isLoading}
          error={error}
        />
      );
    }

    if (activeTab === 'skins') {
      return (
        <SkinsLeaderboard 
          skins={skinsData}
          isLoading={isLoading}
          error={error}
          gameType={selectedGame.gameType}
          onSkinSelect={(holeNumber, type) => {
            setSelectedSkin({ holeNumber, type });
          }}
        />
      );
    }

    if (activeTab === 'payouts') {
      return (
        <PayoutsLeaderboard 
          payouts={payoutsData}
          isLoading={isLoading}
          error={error}
        />
      );
    }

    return null;
  };

  if (selectedSkin && selectedGame) {
    return (
      <SkinsDetailScreen
        gameId={selectedGame.gameID}
        holeNumber={selectedSkin.holeNumber}
        skinsType={selectedSkin.type}
        onBack={() => setSelectedSkin(null)}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
        <nav className="border-b border-gray-200">
          <div className="-mb-px flex justify-between">
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
          </div>
        </nav>
        <div className="mt-4">
          {renderLeaderboard()}
        </div>
      </div>
    </div>
  );
}
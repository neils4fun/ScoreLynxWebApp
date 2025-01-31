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
import { RotateCw } from 'lucide-react';

interface SelectedSkin {
  holeNumber: number;
  type: 'Net' | 'Gross';
}

export default function LeaderboardScreen() {
  const { selectedGame } = useGame();
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('leaderboardActiveTab');
    return saved || 'team';
  });
  const [selectedSkin, setSelectedSkin] = useState<SelectedSkin | null>(null);
  const [matchplayData, setMatchplayData] = useState<MatchplayLeader[]>([]);
  const [playerData, setPlayerData] = useState<PlayerLeader[]>([]);
  const [teamData, setTeamData] = useState<TeamLeader[]>([]);
  const [skinsData, setSkinsData] = useState<Skin[]>([]);
  const [payoutsData, setPayoutsData] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerHeaders, setPlayerHeaders] = useState<string[][]>([]);
  const [payoutHeaders, setPayoutHeaders] = useState<string[][]>([]);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leaderboardActiveTab', activeTab);
  }, [activeTab]);

  // Reset to default tab when game type changes
  useEffect(() => {
    if (selectedGame?.teamPlayerType === 'Player') {
      setActiveTab('player');
    }
  }, [selectedGame]);

  const getLeaderboardTabs = () => {
    if (!selectedGame) return [];
    
    if (selectedGame.teamPlayerType === 'Matchplay') {
      return [
        { id: 'team', label: 'Matchplay' },
        { id: 'player', label: 'Player' },
        { id: 'skins', label: 'Skins' },
        { id: 'payouts', label: 'Payouts' },
      ];
    } else if (selectedGame.teamPlayerType === 'Player') {
      return [
        { id: 'player', label: 'Player' },
        { id: 'skins', label: 'Skins' },
        { id: 'payouts', label: 'Payouts' },
      ];
    } else {
      return [
        { id: 'team', label: 'Team' },
        { id: 'player', label: 'Player' },
        { id: 'skins', label: 'Skins' },
        { id: 'payouts', label: 'Payouts' },
      ];
    }
  };

  const loadLeaderboardData = async () => {
    if (!selectedGame?.gameID) return;

    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'team') {
        if (selectedGame.teamPlayerType === 'Matchplay') {
          const data = await fetchMatchplayLeaderboard(selectedGame.gameID);
          setMatchplayData(data.leaders.flat());
        } else {
          const data = await fetchTeamLeaderboard(selectedGame.gameID);
          setTeamData(data.leaders.flat());
        }
      } else if (activeTab === 'player') {
        const data = await fetchPlayerLeaderboard(selectedGame.gameID);
        setPlayerData(data.leaders.flat());
        setPlayerHeaders(data.headers);
      } else if (activeTab === 'skins') {
        const data = await fetchSkins(selectedGame.gameID);
        setSkinsData(data.skins.flat());
      } else if (activeTab === 'payouts') {
        const data = await fetchPayouts(selectedGame.gameID);
        setPayoutsData(data.payouts.flat());
        setPayoutHeaders(data.headers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

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
          headers={playerHeaders}
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
          headers={payoutHeaders}
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
        <div className="max-w-sm mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
            <button
              onClick={() => loadLeaderboardData()}
              disabled={isLoading}
              className={`p-2 hover:bg-gray-100 rounded-full
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                transition-transform active:scale-95`}
            >
              <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
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
        </div>
        <div className="w-full overflow-hidden">
          <div className="max-w-sm mx-auto w-full">
            {renderLeaderboard()}
          </div>
        </div>
      </div>
    </div>
  );
}
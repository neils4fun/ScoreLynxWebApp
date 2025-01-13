import { useState, useEffect } from 'react';
import { TabBar } from './components/navigation/TabBar';
import GamesScreen from './screens/GamesScreen';
import { ScorecardScreen } from './screens/ScorecardScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import { GameProvider } from './context/GameContext';
import { GroupProvider } from './context/GroupContext';
import { ScorecardProvider } from './context/ScorecardContext';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'games';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'games':
        return <GamesScreen />;
      case 'scorecard':
        return <ScorecardScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      default:
        return <GamesScreen />;
    }
  };

  return (
    <GroupProvider>
      <GameProvider>
        <ScorecardProvider>
          <div className="min-h-screen bg-gray-50 pb-16">
            <div className="max-w-2xl mx-auto">
              {renderScreen()}
            </div>
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </ScorecardProvider>
      </GameProvider>
    </GroupProvider>
  );
}
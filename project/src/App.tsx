import { useState } from 'react';
import { TabBar } from './components/navigation/TabBar';
import GamesScreen from './screens/GamesScreen';
import { ScorecardScreen } from './screens/ScorecardScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import { GameProvider } from './context/GameContext';
import { GroupProvider } from './context/GroupContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('games');

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
        <div className="min-h-screen bg-gray-50 pb-16">
          <div className="max-w-2xl mx-auto">
            {renderScreen()}
          </div>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </GameProvider>
    </GroupProvider>
  );
}
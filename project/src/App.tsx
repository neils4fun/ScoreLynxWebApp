import { useState, useEffect } from 'react';
import { TabBar } from './components/navigation/TabBar';
import GamesScreen from './screens/GamesScreen';
import { ScorecardScreen } from './screens/ScorecardScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import CourseMaintenanceScreen from './screens/CourseMaintenanceScreen';
import MessagesScreen from './screens/MessagesScreen';
import { GameProvider } from './context/GameContext';
import { GroupProvider } from './context/GroupContext';
import { ScorecardProvider } from './context/ScorecardContext';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'games';
  });
  const [showCourseMaintenance, setShowCourseMaintenance] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderScreen = () => {
    if (showCourseMaintenance) {
      return (
        <CourseMaintenanceScreen
          onBack={() => setShowCourseMaintenance(false)}
        />
      );
    }

    if (showMessages) {
      return (
        <MessagesScreen
          onBack={() => setShowMessages(false)}
        />
      );
    }

    switch (activeTab) {
      case 'games':
        return <GamesScreen />;
      case 'scorecard':
        return <ScorecardScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'settings':
        return (
          <SettingsScreen
            onNavigateToCourseMaintenance={() => setShowCourseMaintenance(true)}
            onNavigateToMessages={() => setShowMessages(true)}
          />
        );
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
            {!showCourseMaintenance && !showMessages && (
              <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            )}
          </div>
        </ScorecardProvider>
      </GameProvider>
    </GroupProvider>
  );
}
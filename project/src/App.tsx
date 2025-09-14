import { useState, useEffect } from 'react';
import { TabBar } from './components/navigation/TabBar';
import GamesScreen from './screens/GamesScreen';
import { ScorecardScreen } from './screens/ScorecardScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import CourseMaintenanceScreen from './screens/CourseMaintenanceScreen';
import MessagesScreen from './screens/MessagesScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import InformationScreen from './screens/InformationScreen';
import GameInformationScreen from './screens/GameInformationScreen';
import SkinsInformationScreen from './screens/SkinsInformationScreen';
import JunkInformationScreen from './screens/JunkInformationScreen';
import { GameProvider } from './context/GameContext';
import { GroupProvider } from './context/GroupContext';
import { ScorecardProvider } from './context/ScorecardContext';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'games';
  });
  const [showCourseMaintenance, setShowCourseMaintenance] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showInformation, setShowInformation] = useState(false);
  const [showGameInformation, setShowGameInformation] = useState(false);
  const [showSkinsInformation, setShowSkinsInformation] = useState(false);
  const [showJunkInformation, setShowJunkInformation] = useState(false);

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

    if (showReports) {
      return (
        <ReportsScreen
          onBack={() => setShowReports(false)}
        />
      );
    }

    if (showJunkInformation) {
      return (
        <JunkInformationScreen
          onBack={() => setShowJunkInformation(false)}
        />
      );
    }

    if (showSkinsInformation) {
      return (
        <SkinsInformationScreen
          onBack={() => setShowSkinsInformation(false)}
        />
      );
    }

    if (showGameInformation) {
      return (
        <GameInformationScreen
          onBack={() => setShowGameInformation(false)}
        />
      );
    }

    if (showInformation) {
      return (
        <InformationScreen
          onBack={() => setShowInformation(false)}
          onNavigateToGameInformation={() => setShowGameInformation(true)}
          onNavigateToSkinsInformation={() => setShowSkinsInformation(true)}
          onNavigateToJunkInformation={() => setShowJunkInformation(true)}
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
            onNavigateToReports={() => setShowReports(true)}
            onNavigateToInformation={() => setShowInformation(true)}
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
            {!showCourseMaintenance && !showMessages && !showReports && !showInformation && !showGameInformation && !showSkinsInformation && !showJunkInformation && (
              <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            )}
          </div>
        </ScorecardProvider>
      </GameProvider>
    </GroupProvider>
  );
}
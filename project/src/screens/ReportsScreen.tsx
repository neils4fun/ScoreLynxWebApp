import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Users, Calendar, BarChart2, Clock, AlertCircle } from 'lucide-react';
import { useGroup } from '../context/GroupContext';
import { useGame } from '../context/GameContext';
import { getTeeSheetReport, getGroupPlayerHistoryReport } from '../api/reportsApi';
import { TeeSheetReportView } from '../components/reports/TeeSheetReportView';
import { GroupPlayerHistoryView } from '../components/reports/GroupPlayerHistoryView';
import { DateRangeSelector } from '../components/reports/DateRangeSelector';
import type { TeeSheetReportResponse, GroupPlayerHistoryResponse } from '../api/reportsApi';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'game' | 'group';
}

export function ReportsScreen({ onBack }: { onBack: () => void }) {
  const { selectedGroup } = useGroup();
  const { selectedGame } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'game' | 'group'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teeSheetReport, setTeeSheetReport] = useState<TeeSheetReportResponse | null>(null);
  const [groupPlayerHistoryReport, setGroupPlayerHistoryReport] = useState<GroupPlayerHistoryResponse | null>(null);
  const [showNotAvailableAlert, setShowNotAvailableAlert] = useState(false);
  const [showSelectionAlert, setShowSelectionAlert] = useState(false);
  const [selectionAlertMessage, setSelectionAlertMessage] = useState('');
  const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear not available alert after 5 seconds
  useEffect(() => {
    if (showNotAvailableAlert) {
      const timer = setTimeout(() => {
        setShowNotAvailableAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotAvailableAlert]);

  // Clear selection alert after 5 seconds
  useEffect(() => {
    if (showSelectionAlert) {
      const timer = setTimeout(() => {
        setShowSelectionAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSelectionAlert]);

  const reportOptions: ReportOption[] = [
    {
      id: 'game-tee-sheet',
      title: 'Game Tee Sheet',
      description: 'Tee times and player assignments for a specific game',
      icon: <Clock className="w-6 h-6" />,
      category: 'game'
    },
    {
      id: 'group-activity',
      title: 'Group Player History',
      description: 'Aggregate player history for a group',
      icon: <Calendar className="w-6 h-6" />,
      category: 'group'
    },
    {
      id: 'game-summary',
      title: 'Game Summary',
      description: 'Detailed summary of a specific game including scores, payouts, and statistics',
      icon: <FileText className="w-6 h-6" />,
      category: 'game'
    },
    {
      id: 'player-performance',
      title: 'Player Performance',
      description: 'Track player performance across multiple games',
      icon: <Users className="w-6 h-6" />,
      category: 'game'
    },
    {
      id: 'leaderboard-history',
      title: 'Leaderboard History',
      description: 'Historical leaderboard data for the group',
      icon: <BarChart2 className="w-6 h-6" />,
      category: 'group'
    }
  ];

  const filteredReports = selectedCategory === 'all' 
    ? reportOptions 
    : reportOptions.filter(report => report.category === selectedCategory);

  const handleGenerateReport = async (reportId: string) => {
    setError(null);
    setShowNotAvailableAlert(false);
    setShowSelectionAlert(false);
    
    if (reportId === 'game-tee-sheet') {
      if (!selectedGame) {
        setSelectionAlertMessage('Please use the game tab to select a game before generating this report.');
        setShowSelectionAlert(true);
        return;
      }
      
      // Directly generate the report without showing the confirmation modal
      setIsLoading(true);
      try {
        const report = await getTeeSheetReport(selectedGame.gameID);
        setTeeSheetReport(report);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate tee sheet report');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    if (reportId === 'group-activity') {
      if (!selectedGroup) {
        setSelectionAlertMessage('Please use the game tab to select a group before generating this report.');
        setShowSelectionAlert(true);
        return;
      }
      
      // Show date range selector for group player history report
      setSelectedReportId(reportId);
      setShowDateRangeSelector(true);
      return;
    }
    
    // For all other report types, display a message
    setShowNotAvailableAlert(true);
  };

  const handleDateRangeConfirm = async (startDate: string | undefined, endDate: string | undefined) => {
    setShowDateRangeSelector(false);
    
    if (!selectedGroup || !selectedReportId) {
      return;
    }
    
    setIsLoading(true);
    try {
      const report = await getGroupPlayerHistoryReport(selectedGroup.groupID, startDate, endDate);
      setGroupPlayerHistoryReport(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate group player history report');
    } finally {
      setIsLoading(false);
    }
  };

  if (teeSheetReport) {
    return (
      <TeeSheetReportView
        report={teeSheetReport}
        onBack={() => setTeeSheetReport(null)}
      />
    );
  }

  if (groupPlayerHistoryReport) {
    return (
      <GroupPlayerHistoryView
        report={groupPlayerHistoryReport}
        onBack={() => setGroupPlayerHistoryReport(null)}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold ml-4">Reports</h1>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setSelectedCategory('game')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === 'game' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Game Reports
          </button>
          <button
            onClick={() => setSelectedCategory('group')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === 'group' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Group Reports
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedGroup ? (
          <div className="space-y-4">
            {filteredReports.map(report => (
              <div 
                key={report.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    {report.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">{report.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{report.description}</p>
                    <button 
                      className="mt-3 text-blue-600 text-sm font-medium"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={isLoading}
                    >
                      {isLoading && selectedGame ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Please select a group to view reports</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Not Available Alert */}
        {showNotAvailableAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-lg font-bold">Report Not Available</h2>
              </div>
              <p className="text-gray-600 mb-4">
                This report is not yet available. Please check back later.
              </p>
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => setShowNotAvailableAlert(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selection Alert */}
        {showSelectionAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-lg font-bold">Selection Required</h2>
              </div>
              <p className="text-gray-600 mb-4">
                {selectionAlertMessage}
              </p>
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => setShowSelectionAlert(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Date Range Selector */}
        {showDateRangeSelector && (
          <DateRangeSelector
            onConfirm={handleDateRangeConfirm}
            onCancel={() => setShowDateRangeSelector(false)}
          />
        )}
      </div>
    </div>
  );
} 
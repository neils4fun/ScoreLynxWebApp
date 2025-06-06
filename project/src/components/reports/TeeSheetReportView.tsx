import { ArrowLeft, Download, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { TeeSheetReportResponse, TeeSheetScorecard, TeeSheetPlayer } from '../../api/reportsApi';
import { fetchWeatherForecast, type WeatherResponse } from '../../api/weatherApi';
import { fetchCourse } from '../../api/gameApi';

interface TeeSheetReportViewProps {
  report: TeeSheetReportResponse;
  courseID?: string;
  onBack: () => void;
}

export function TeeSheetReportView({ report, courseID, onBack }: TeeSheetReportViewProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setWeatherError(null);
        const cid = courseID || report.courseID;
        const course = await fetchCourse(cid);
        const gameDate = new Date(report.gameDate);
        const weatherData = await fetchWeatherForecast(course.city, course.state, gameDate);
        setWeather(weatherData);
      } catch (err) {
        console.error('Failed to load weather:', err);
        setWeatherError(err instanceof Error ? err.message : 'Failed to load weather forecast');
      }
    };
    const cid = courseID || report.courseID;
    if (cid) {
      loadWeather();
    } else {
      setWeatherError('No course ID available for weather lookup');
    }
  }, [courseID, report.courseID, report.gameDate]);

  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = `Course,${report.courseName}\n`;
    csvContent += `Tee,${report.teeName}\n`;
    csvContent += `Game,${report.gameType}\n`;
    csvContent += `Skins,${report.skinType}\n\n`;
    
    // Add header row for scorecards
    csvContent += 'Scorecard,';
    
    // Find the maximum number of players in any scorecard
    const maxPlayers = Math.max(...report.scorecards.map(sc => sc.players.length));
    
    // Add player headers (Player 1, Handicap 1, Tee 1, Email 1, etc.)
    for (let i = 0; i < maxPlayers; i++) {
      csvContent += `Player ${i+1},Handicap ${i+1},Tee ${i+1},Email ${i+1}${i < maxPlayers - 1 ? ',' : ''}`;
    }
    csvContent += '\n';
    
    // Add each scorecard as a row
    report.scorecards.forEach(scorecard => {
      csvContent += `${scorecard.name},`;
      
      // Add player data
      for (let i = 0; i < maxPlayers; i++) {
        if (i < scorecard.players.length) {
          const player = scorecard.players[i];
          csvContent += `${player.firstName} ${player.lastName},${player.handicap},${player.tee.name},${player.email || ''}`;
        } else {
          csvContent += ',,,';
        }
        
        if (i < maxPlayers - 1) {
          csvContent += ',';
        }
      }
      
      csvContent += '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tee_sheet_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailReport = () => {
    // Extract all non-null email addresses
    const emailAddresses = report.scorecards
      .flatMap(scorecard => scorecard.players)
      .map(player => player.email)
      .filter((email): email is string => email !== null && email !== '');

    // Generate email body
    let emailBody = `Course: ${report.courseName}\n`;
    emailBody += `Tee: ${report.teeName}\n`;
    emailBody += `Game Type: ${report.gameType}\n`;
    emailBody += `Skin Type: ${report.skinType}\n\n`;

    // Add weather forecast if available
    if (weather) {
      emailBody += 'Weather Forecast:\n';
      emailBody += `Temperature: ${Math.round(weather.main.temp)}°F\n`;
      emailBody += `Feels like: ${Math.round(weather.main.feels_like)}°F\n`;
      emailBody += `Conditions: ${weather.weather[0].description}\n`;
      emailBody += `Wind: ${Math.round(weather.wind.speed)} mph\n\n`;
    } else if (weatherError) {
      emailBody += `Weather Forecast: ${weatherError}\n\n`;
    }

    report.scorecards.forEach(scorecard => {
      emailBody += `Scorecard: ${scorecard.name}\n`;
      emailBody += 'Players:\n';
      scorecard.players.forEach(player => {
        emailBody += `- ${player.firstName} ${player.lastName} (${player.handicap}) - ${player.tee.name}\n`;
      });
      emailBody += '\n';
    });

    emailBody += '\nFollow this link for ScoreLynxPro on the web: http://www.scorelynxpro.com/slp_web/\n';

    // Create mailto link with semicolon-separated email addresses
    const mailtoLink = `mailto:${emailAddresses.join(';')}?subject=Tee Sheet Report - ${report.courseName}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">Tee Sheet Report</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEmailReport}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Game Info */}
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              <p>Course: {report.courseName}</p>
              <p>Tee: {report.teeName}</p>
              <p>Game Type: {report.gameType}</p>
              <p>Skin Type: {report.skinType}</p>
              {weather && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="font-medium">Weather Forecast:</p>
                  <p>Temperature: {Math.round(weather.main.temp)}°F</p>
                  <p>Feels like: {Math.round(weather.main.feels_like)}°F</p>
                  <p>Conditions: {weather.weather[0].description}</p>
                  <p>Wind: {Math.round(weather.wind.speed)} mph</p>
                </div>
              )}
              {weatherError && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-red-600">
                  <p>Weather Forecast: {weatherError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Scorecards */}
          {report.scorecards.map((scorecard: TeeSheetScorecard, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-md font-semibold mb-2">{scorecard.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Handicap</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tee</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scorecard.players.map((player: TeeSheetPlayer) => (
                      <tr key={player.playerID}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {player.firstName} {player.lastName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {player.handicap}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {player.tee.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {player.email || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
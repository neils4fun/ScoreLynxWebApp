import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fetchScorecardPlayerList, fetchCourse } from '../api/scorecardApi';
import { useGame } from '../context/GameContext';
import type { Player } from '../types/scorecard';
import type { Hole } from '../types/course';

interface ScoringScreenProps {
  onBack: () => void;
  gameId: string;
  scorecardId: string;
}

export function ScoringScreen({ onBack, gameId, scorecardId }: ScoringScreenProps) {
  const { selectedGame } = useGame();
  const [players, setPlayers] = useState<Player[]>([]);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!selectedGame?.courseID) {
        setError('No course selected');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [playerData, courseData] = await Promise.all([
          fetchScorecardPlayerList(gameId, scorecardId),
          fetchCourse(selectedGame.courseID)
        ]);

        setPlayers(playerData.players);
        setHoles(courseData.course.tees[0].holes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [gameId, scorecardId, selectedGame?.courseID]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading scoring data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Enter Scores</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="divide-y divide-gray-200 table-layout: fixed;">
          <thead className="bg-gray-50">
            <tr className="divide-x divide-gray-200">
            <th className="px-2 py-1 text-xs font-medium text-gray-500 tracking-wider width: 10px"> 
              <div className="flex items-end justify-end">
                <span className="transform -rotate-90 absolute -translate-x-[-10px] -translate-y-[-5px]">HOLE</span>
              </div>
            </th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 tracking-wider width: 10px">
                <div className="flex items-end justify-end">
                  <span className="transform -rotate-90 absolute -translate-x-[-10px] -translate-y-[-5px]">INDEX</span>
                </div>
              </th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 tracking-wider width: 10px">
                <div className="flex items-end justify-end">
                  <span className="transform -rotate-90 absolute -translate-x-[-10px] -translate-y-[-5px]">PAR</span>
                </div>
              </th>
              {players.map((player) => (
                <th key={player.playerID} className="px-2 py-1 text-xs font-medium text-gray-500 tracking-wider">
                  <div className="flex items-end justify-end pr-6 pb-4">
                    <span className="transform -rotate-90">
                      {player.firstName}<br/>{player.lastName}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
            <tr className="divide-x divide-gray-200">
              <th className="px-2 py-2 text-xs font-medium text-gray-500 tracking-wider" colSpan={3}>
                HDCP
              </th>
              {players.map((player) => (
                <th key={player.playerID} className="px-2 py-2 text-xs font-medium text-gray-500 tracking-wider text-center">
                  {player.handicap}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holes.map((hole) => (
              <tr key={hole.number} className="divide-x divide-gray-200">
                <td className="px-2 py-0 text-right text-sm text-gray-900">{hole.number}</td>
                <td className="px-2 py-2 text-right text-sm text-gray-900 min-w-1">{hole.matchPlayHandicap}</td>
                <td className="px-2 py-2 text-right text-sm text-gray-900 min-w-1">{hole.par}</td>
                {players.map((player) => {
                  const score = player.scores.find(s => s.holeNumber === hole.number);
                  return (
                    <td key={player.playerID} className="px-2 py-2 text-sm">
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={score?.grossScore || ''}
                          onChange={() => {}} // TODO: Implement score updating
                          className="w-12 px-0 py-1 border rounded text-right"
                          placeholder="Gross"
                        />
                        <input
                          type="number"
                          value={score?.netScore || ''}
                          onChange={() => {}} // TODO: Implement score updating
                          className="w-12 px-2 py-1 border rounded text-right bg-gray-50"
                          placeholder="Net"
                          disabled
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

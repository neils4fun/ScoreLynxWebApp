import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fetchPlayerScores } from '../api/playerApi';
import { fetchCourse } from '../api/scorecardApi';
import type { Hole } from '../types/course';

interface PlayerScorecardScreenProps {
  gameId: string;
  playerId: string;
  courseId: string;
  playerName: string;
  onBack: () => void;
}

export function PlayerScorecardScreen({ 
  gameId, 
  playerId, 
  courseId,
  playerName,
  onBack 
}: PlayerScorecardScreenProps) {
  const [holes, setHoles] = useState<Hole[]>([]);
  const [playerData, setPlayerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [courseData, scoresData] = await Promise.all([
          fetchCourse(courseId),
          fetchPlayerScores(gameId, playerId)
        ]);

        setHoles(courseData.course.tees[0].holes);
        setPlayerData(scoresData.player);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [gameId, playerId, courseId]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading scorecard...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  const renderScore = (holeNumber: number) => {
    const score = playerData?.scores.find((s: any) => s.holeNumber === holeNumber);
    const hole = holes.find(h => h.number === holeNumber);
    const isUnderPar = score?.grossScore && hole?.par && score.grossScore < hole.par;

    return (
      <div className="flex space-x-1">
        <div className={`w-8 px-0 py-1 text-right ${isUnderPar ? 'text-red-600' : 'text-gray-900'}`}>
          {score?.grossScore || ''}
        </div>
        <div className="w-8 py-1 text-right text-sm text-gray-900">
          {score?.netScore || ''}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 ml-4">{playerName}'s Scorecard</h2>
      </div>

      <div className="relative max-h-[calc(100vh-8rem)] overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-8rem)]">
          <div className="inline-block min-w-full max-w-3xl ml-4">
            <table className="divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col className="w-8" />
                <col className="w-8" />
                <col className="w-10" />
                <col className="w-16" />
              </colgroup>
              <thead className="bg-gray-50">
                <tr className="divide-x divide-gray-200">
                  <th className="sticky top-0 left-0 z-40 p-0 text-xs font-medium text-gray-500 tracking-wider w-8 h-24 relative bg-gray-50 after:absolute after:inset-0 after:bg-gray-50">
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="-rotate-90 whitespace-nowrap">HOLE</div>
                    </div>
                  </th>
                  <th className="sticky top-0 left-8 z-40 p-0 text-xs font-medium text-gray-500 tracking-wider w-8 h-24 relative bg-gray-50 after:absolute after:inset-0 after:bg-gray-50">
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="-rotate-90 whitespace-nowrap">INDEX</div>
                    </div>
                  </th>
                  <th className="sticky top-0 left-16 z-40 p-0 text-xs font-medium text-gray-500 tracking-wider w-10 h-24 relative bg-gray-50 after:absolute after:inset-0 after:bg-gray-50">
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="-rotate-90 whitespace-nowrap">PAR</div>
                    </div>
                  </th>
                  <th className="sticky top-0 z-40 px-1 py-1 text-xs font-medium text-gray-500 tracking-wider w-16 h-24 bg-gray-50">
                    <div className="h-full flex items-center justify-center">
                      <span className="-rotate-90 whitespace-pre text-center">
                        SCORE
                      </span>
                    </div>
                  </th>
                </tr>
                <tr className="divide-x divide-gray-200">
                  <th className="sticky top-24 left-0 z-40 px-2 py-2 text-xs font-medium text-gray-500 tracking-wider bg-gray-50 after:absolute after:inset-0 after:bg-gray-50" colSpan={3}>
                    <div className="relative z-10">HDCP</div>
                  </th>
                  <th className="sticky top-24 z-40 px-1 py-1 text-xs font-medium text-gray-500 tracking-wider text-center bg-gray-50">
                    {playerData?.handicap || 'N/A'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holes.slice(0, 9).map((hole) => (
                  <tr key={hole.number} className="divide-x divide-gray-200">
                    <td className="sticky left-0 z-20 px-2 py-0 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                      <div className="relative z-10">{hole.number}</div>
                    </td>
                    <td className="sticky left-8 z-20 px-2 py-2 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                      <div className="relative z-10">{hole.matchPlayHandicap}</div>
                    </td>
                    <td className="sticky left-16 z-20 px-2 py-2 text-right text-sm text-gray-900 bg-white w-10 after:absolute after:inset-0 after:bg-white">
                      <div className="relative z-10">{hole.par}</div>
                    </td>
                    <td className="px-1 py-1 text-sm">
                      {renderScore(hole.number)}
                    </td>
                  </tr>
                ))}
                <tr className="divide-x divide-gray-200 bg-gray-100">
                  <td className="sticky left-0 z-30 px-2 py-2 text-right text-sm font-bold bg-gray-100 after:absolute after:inset-0 after:bg-gray-100" colSpan={3}>
                    <div className="relative z-10">Out</div>
                  </td>
                  <td className="px-1 py-1 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {playerData?.scores
                          .filter((s: any) => s.holeNumber <= 9)
                          .reduce((sum: number, s: any) => sum + (s.grossScore || 0), 0)}
                      </div>
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {playerData?.scores
                          .filter((s: any) => s.holeNumber <= 9)
                          .reduce((sum: number, s: any) => sum + (s.netScore || 0), 0)}
                      </div>
                    </div>
                  </td>
                </tr>
                {holes.slice(9).map((hole) => (
                  <tr key={hole.number} className="divide-x divide-gray-200">
                    <td className="sticky left-0 z-20 px-2 py-0 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                      <div className="relative z-10">{hole.number}</div>
                    </td>
                    <td className="sticky left-8 z-20 px-2 py-2 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                      <div className="relative z-10">{hole.matchPlayHandicap}</div>
                    </td>
                    <td className="sticky left-16 z-20 px-2 py-2 text-right text-sm text-gray-900 bg-white w-10 after:absolute after:inset-0 after:bg-white">
                      <div className="relative z-10">{hole.par}</div>
                    </td>
                    <td className="px-1 py-1 text-sm">
                      {renderScore(hole.number)}
                    </td>
                  </tr>
                ))}
                <tr className="divide-x divide-gray-200 bg-gray-100">
                  <td className="sticky left-0 z-30 px-2 py-2 text-right text-sm font-bold bg-gray-100 after:absolute after:inset-0 after:bg-gray-100" colSpan={3}>
                    <div className="relative z-10">In</div>
                  </td>
                  <td className="px-1 py-1 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {playerData?.scores
                          .filter((s: any) => s.holeNumber > 9)
                          .reduce((sum: number, s: any) => sum + (s.grossScore || 0), 0)}
                      </div>
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {playerData?.scores
                          .filter((s: any) => s.holeNumber > 9)
                          .reduce((sum: number, s: any) => sum + (s.netScore || 0), 0)}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="divide-x divide-gray-200 bg-gray-100">
                  <td className="sticky left-0 z-30 px-2 py-2 text-right text-sm font-bold bg-gray-100 after:absolute after:inset-0 after:bg-gray-100" colSpan={3}>
                    <div className="relative z-10">Total</div>
                  </td>
                  <td className="px-1 py-1 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {playerData?.scores
                          .reduce((sum: number, s: any) => sum + (s.grossScore || 0), 0)}
                      </div>
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {playerData?.scores
                          .reduce((sum: number, s: any) => sum + (s.netScore || 0), 0)}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
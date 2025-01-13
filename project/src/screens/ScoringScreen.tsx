import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { fetchScorecardPlayerList, fetchCourse, updateScore } from '../api/scorecardApi';
import { useGame } from '../context/GameContext';
import type { Player, Score } from '../types/scorecard';
import type { Hole } from '../types/course';
import { useScorecard } from '../context/ScorecardContext';

interface ScoringScreenProps {
  onBack: () => void;
  gameId: string;
  scorecardId: string;
}

export function ScoringScreen({ onBack, gameId, scorecardId }: ScoringScreenProps) {
  const { selectedGame } = useGame();
  const { players, setPlayers } = useScorecard();
  const [holes, setHoles] = useState<Hole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingScores, setUpdatingScores] = useState<Set<string>>(new Set());

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, [gameId, scorecardId, selectedGame?.courseID]);

  const handleScoreChange = async (playerId: string, holeNumber: number, newScore: number) => {
    const scoreKey = `${playerId}-${holeNumber}`;
    
    try {
      setUpdatingScores(prev => new Set(prev).add(scoreKey));
      
      // Make the API call and get the response with net score
      const scoreResponse = await updateScore(gameId, playerId, holeNumber, newScore);

      // Update local state with both gross and net scores
      setPlayers(prevPlayers => 
        prevPlayers.map(player => {
          if (player.playerID !== playerId) return player;
          
          const newScores = player.scores.some(s => s.holeNumber === holeNumber)
            ? player.scores.map(score => {
                if (score.holeNumber !== holeNumber) return score;
                return { 
                  ...score, 
                  grossScore: scoreResponse.score,
                  netScore: scoreResponse.net 
                };
              })
            : [
                ...player.scores,
                {
                  holeNumber,
                  grossScore: scoreResponse.score,
                  netScore: scoreResponse.net,
                  scoreID: scoreResponse.scoreID,
                  playerID: playerId,
                  gameID: gameId
                } as Score
              ];

          return {
            ...player,
            scores: newScores
          };
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update score');
    } finally {
      setUpdatingScores(prev => {
        const next = new Set(prev);
        next.delete(scoreKey);
        return next;
      });
    }
  };

  // Update the score input rendering in both hole sections:
  const renderScoreInput = (player: Player, holeNumber: number) => {
    const score = player.scores.find(s => s.holeNumber === holeNumber);
    const hole = holes.find(h => h.number === holeNumber);
    const scoreKey = `${player.playerID}-${holeNumber}`;
    const isUpdating = updatingScores.has(scoreKey);
    const isUnderPar = score?.grossScore && hole?.par && score.grossScore < hole.par;

    return (
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        value={score?.grossScore || ''}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const value = e.target.value;
          // Allow empty string or positive integers only
          if (value === '' || /^[1-9]\d*$/.test(value)) {
            if (value !== '') {  // Only process non-empty values
              const newScore = parseInt(value, 10);
              handleScoreChange(player.playerID, holeNumber, newScore);
            }
          }
        }}
        disabled={isUpdating}
        className={`w-8 px-0 py-1 border rounded text-right
          ${isUpdating ? 'bg-gray-100' : 'bg-white'}
          ${isUpdating ? 'cursor-not-allowed' : 'cursor-text'}
          ${isUnderPar ? 'text-red-600' : 'text-gray-900'}
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none`}
        placeholder=""
      />
    );
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading scoring data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Enter Scores</h2>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className={`p-2 hover:bg-gray-100 rounded-full
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            transition-transform active:scale-95`}
        >
          <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
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
                <th key={player.playerID} className="px-1 py-1 text-xs font-medium text-gray-500 tracking-wider width: 16px">
                  <div className="flex items-end justify-end pr-4 pb-4">
                    <span className="transform -rotate-90">
                      {player.firstName}<br />{player.lastName}
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
                <th key={player.playerID} className="px-1 py-1 text-xs font-medium text-gray-500 tracking-wider text-center">
                  {player.handicap}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holes.slice(0, 9).map((hole) => (
              <tr key={hole.number} className="divide-x divide-gray-200">
                <td className="px-2 py-0 text-right text-sm text-gray-900">{hole.number}</td>
                <td className="px-2 py-2 text-right text-sm text-gray-900 min-w-1">{hole.matchPlayHandicap}</td>
                <td className="px-2 py-2 text-right text-sm text-gray-900 min-w-1">{hole.par}</td>
                {players.map((player) => (
                  <td key={player.playerID} className="px-1 py-1 text-sm">
                    <div className="flex space-x-1">
                      {renderScoreInput(player, hole.number)}
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {player.scores.find(s => s.holeNumber === hole.number)?.netScore || ''}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {/* Front 9 Totals Row */}
            <tr className="divide-x divide-gray-200 bg-gray-100">
              <td className="px-2 py-2 text-right text-sm font-bold" colSpan={3}>Out</td>
              {players.map((player) => (
                <td key={player.playerID} className="px-1 py-1 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-8 py-1 text-right text-sm text-gray-900">{player.scores.slice(0, 9).reduce((sum, score) => sum + (score?.grossScore || 0), 0)}</div>
                    <div className="w-8 py-1 text-right text-sm text-gray-900">{player.scores.slice(0, 9).reduce((sum, score) => sum + (score?.netScore || 0), 0)}</div>
                  </div>
                </td>
              ))}
            </tr>
            {holes.slice(9).map((hole) => (
              <tr key={hole.number} className="divide-x divide-gray-200">
                <td className="px-2 py-0 text-right text-sm text-gray-900">{hole.number}</td>
                <td className="px-2 py-2 text-right text-sm text-gray-900 min-w-1">{hole.matchPlayHandicap}</td>
                <td className="px-2 py-2 text-right text-sm text-gray-900 min-w-1">{hole.par}</td>
                {players.map((player) => (
                  <td key={player.playerID} className="px-1 py-1 text-sm">
                    <div className="flex space-x-1">
                      {renderScoreInput(player, hole.number)}
                      <div className="w-8 py-1 text-right text-sm text-gray-900">
                        {player.scores.find(s => s.holeNumber === hole.number)?.netScore || ''}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {/* Back 9 Totals Row */}
            <tr className="divide-x divide-gray-200 bg-gray-100">
              <td className="px-2 py-2 text-right text-sm font-bold" colSpan={3}>In</td>
              {players.map((player) => (
                <td key={player.playerID} className="px-1 py-1 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-8 py-1 text-right text-sm text-gray-900">{player.scores.slice(9).reduce((sum, score) => sum + (score?.grossScore || 0), 0)}</div>
                    <div className="w-8 py-1 text-right text-sm text-gray-900">{player.scores.slice(9).reduce((sum, score) => sum + (score?.netScore || 0), 0)}</div>
                  </div>
                </td>
              ))}
            </tr>
            {/* Total 18 Totals Row */}
            <tr className="divide-x divide-gray-200 bg-gray-100">
              <td className="px-2 py-2 text-right text-sm font-bold" colSpan={3}>Total</td>
              {players.map((player) => (
                <td key={player.playerID} className="px-1 py-1 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-8 py-1 text-right text-sm text-gray-900">{player.scores.reduce((sum, score) => sum + (score?.grossScore || 0), 0)}</div>
                    <div className="w-8 py-1 text-right text-sm text-gray-900">{player.scores.reduce((sum, score) => sum + (score?.netScore || 0), 0)}</div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

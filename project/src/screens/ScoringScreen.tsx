import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { fetchScorecardPlayerList, fetchCourse, updateScore, deleteHoleScore, fetchJunkList } from '../api/scorecardApi';
import { useGame } from '../context/GameContext';
import type { Player, Score as BaseScore, Junk } from '../types/scorecard';
import type { Hole } from '../types/course';
import { useScorecard } from '../context/ScorecardContext';
import { JunkListPopup } from '../components/scorecard/JunkListPopup';

interface ScoringScreenProps {
  onBack: () => void;
  gameId: string;
  scorecardId: string;
}

interface Score extends BaseScore {
  playerID?: string;
}

export function ScoringScreen({ onBack, gameId, scorecardId }: ScoringScreenProps) {
  const { players, setPlayers } = useScorecard();
  const [holes, setHoles] = useState<Hole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedGame } = useGame();
  const [junks, setJunks] = useState<Junk[]>([]);
  const [showJunkList, setShowJunkList] = useState(false);
  const [selectedScore, setSelectedScore] = useState<Score | null>(null);

  const loadData = async () => {
    if (!selectedGame?.courseID) {
      setError('No course selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [playerData, courseData, junkData] = await Promise.all([
        fetchScorecardPlayerList(gameId, scorecardId),
        fetchCourse(selectedGame.courseID),
        fetchJunkList(gameId),
      ]);
      
      // Transform the players data to ensure scores and junks are properly handled
      const players = playerData.players.map(player => ({
        ...player,
        scores: player.scores.map(score => ({
          scoreID: score.scoreID,
          holeNumber: score.holeNumber,
          grossScore: score.grossScore,
          netScore: score.netScore,
          junks: score.junks || [] // Ensure junks is always an array
        }))
      }));

      setPlayers(players);
      setHoles(courseData.course.tees[0].holes);
      setJunks(junkData.junks);
    } catch (err) {
      console.error('Failed to load scorecard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load scorecard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [gameId, scorecardId, selectedGame?.courseID]);

  const handleScoreChange = async (playerId: string, holeNumber: number, newScore: number | null) => {
    try {
      const score = players.find(p => p.playerID === playerId)?.scores.find(s => s.holeNumber === holeNumber);
      
      // If the input is empty and we have an existing score, delete it
      if (newScore === null && score?.scoreID) {
        await deleteHoleScore(score.scoreID);
        // Update local state to remove the score
        setPlayers(prevPlayers => 
          prevPlayers.map(player => {
            if (player.playerID !== playerId) return player;
            return {
              ...player,
              scores: player.scores.filter(s => s.holeNumber !== holeNumber)
            };
          })
        );
        return;
      }

      // Make the API call and get the response with net score
      const scoreResponse = await updateScore(gameId, playerId, holeNumber, newScore || 0);

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
    }
  };

  const handleSaveJunks = async (selectedJunks: Junk[]) => {
    if (selectedScore && selectedScore.playerID) {
      try {
        await updateScore(
          gameId,
          selectedScore.playerID,
          selectedScore.holeNumber,
          selectedScore.grossScore || 0,
          selectedJunks.map(j => j.junkID)
        );
        // Refresh the players data to show updated junks
        const playerData = await fetchScorecardPlayerList(gameId, scorecardId);
        setPlayers(playerData.players);
      } catch (error) {
        console.error('Error saving junks:', error);
      }
    }
    setShowJunkList(false);
    setSelectedScore(null);
  };

  // Update the score input rendering in both hole sections:
  const renderScoreInput = (player: Player, holeNumber: number) => {
    const score = player.scores.find(s => s.holeNumber === holeNumber);

    return (
      <div className="flex items-center">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={score?.grossScore ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^\d+$/.test(value)) {
              handleScoreChange(player.playerID, holeNumber, value === '' ? null : parseInt(value));
            }
          }}
          className="w-8 h-8 text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
        />
        <div 
          className="ml-3 w-8 text-center cursor-pointer select-none hover:bg-gray-50 rounded active:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (score) {
              setSelectedScore({ ...score, playerID: player.playerID });
              setShowJunkList(true);
            }
          }}
        >
          {score?.netScore ?? ''}
          {score?.junks?.length ? <sup className="text-xs text-blue-500">{score.junks.length}</sup> : null}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading scoring data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 ml-4">Enter Scores</h2>
          <button
            onClick={loadData}
            disabled={isLoading}
            className={`p-2 hover:bg-gray-100 rounded-full ml-24
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              transition-transform active:scale-95`}
          >
            <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="relative max-h-[calc(100vh-8rem)] overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-8rem)]">
            <div className="inline-block min-w-full max-w-3xl ml-4">
              <table className="divide-y divide-gray-200 table-fixed">
                <colgroup>
                  <col className="w-8" />
                  <col className="w-8" />
                  <col className="w-8" />
                  {players.map((player) => (
                    <col key={player.playerID} className="w-[4.5rem]" />
                  ))}
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
                    <th className="sticky top-0 left-16 z-40 p-0 text-xs font-medium text-gray-500 tracking-wider w-8 h-24 relative bg-gray-50 after:absolute after:inset-0 after:bg-gray-50">
                      <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="-rotate-90 whitespace-nowrap">PAR</div>
                      </div>
                    </th>
                    {players.map((player) => (
                      <th key={player.playerID} className="sticky top-0 z-40 px-1 py-1 text-xs font-medium text-gray-500 tracking-wider w-[4.5rem] h-24 bg-gray-50">
                        <div className="h-full flex items-center justify-center">
                          <span className="-rotate-90 whitespace-pre text-center">
                            {player.firstName}<br/>{player.lastName}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr className="divide-x divide-gray-200">
                    <th className="sticky top-24 left-0 z-40 px-2 py-2 text-xs font-medium text-gray-500 tracking-wider bg-gray-50 after:absolute after:inset-0 after:bg-gray-50" colSpan={3}>
                      <div className="relative z-10">HDCP</div>
                    </th>
                    {players.map((player) => (
                      <th key={player.playerID} className="sticky top-24 z-40 px-1 py-1 text-xs font-medium text-gray-500 tracking-wider text-center bg-gray-50">
                        {player.handicap}
                      </th>
                    ))}
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
                      <td className="sticky left-16 z-20 px-2 py-2 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                        <div className="relative z-10">{hole.par}</div>
                      </td>
                      {players.map((player) => (
                        <td key={player.playerID} className="px-1 py-1 text-sm">
                          {renderScoreInput(player, hole.number)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="divide-x divide-gray-200 bg-gray-100">
                    <td className="sticky left-0 z-30 px-2 py-2 text-right text-sm font-bold bg-gray-100 after:absolute after:inset-0 after:bg-gray-100" colSpan={3}>
                      <div className="relative z-10">Out</div>
                    </td>
                    {players.map((player) => (
                      <td key={player.playerID} className="px-1 py-1 text-sm">
                        <div className="flex space-x-1 pr-2">
                          <div className="w-8 py-1 text-right text-sm text-gray-900">
                            {player.scores.filter(s => s.holeNumber <= 9).reduce((sum, score) => sum + (score?.grossScore || 0), 0)}
                          </div>
                          <div className="w-8 py-1 text-right text-sm text-gray-900">
                            {player.scores.filter(s => s.holeNumber <= 9).reduce((sum, score) => sum + (score?.netScore || 0), 0)}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {holes.slice(9).map((hole) => (
                    <tr key={hole.number} className="divide-x divide-gray-200">
                      <td className="sticky left-0 z-20 px-2 py-0 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                        <div className="relative z-10">{hole.number}</div>
                      </td>
                      <td className="sticky left-8 z-20 px-2 py-2 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                        <div className="relative z-10">{hole.matchPlayHandicap}</div>
                      </td>
                      <td className="sticky left-16 z-20 px-2 py-2 text-right text-sm text-gray-900 bg-white w-8 after:absolute after:inset-0 after:bg-white">
                        <div className="relative z-10">{hole.par}</div>
                      </td>
                      {players.map((player) => (
                        <td key={player.playerID} className="px-1 py-1 text-sm">
                          {renderScoreInput(player, hole.number)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="divide-x divide-gray-200 bg-gray-100">
                    <td className="sticky left-0 z-30 px-2 py-2 text-right text-sm font-bold bg-gray-100 after:absolute after:inset-0 after:bg-gray-100" colSpan={3}>
                      <div className="relative z-10">In</div>
                    </td>
                    {players.map((player) => (
                      <td key={player.playerID} className="px-1 py-1 text-sm">
                        <div className="flex space-x-1 pr-2">
                          <div className="w-8 py-1 text-right text-sm text-gray-900">
                            {player.scores.filter(s => s.holeNumber > 9).reduce((sum, score) => sum + (score?.grossScore || 0), 0)}
                          </div>
                          <div className="w-8 py-1 text-right text-sm text-gray-900">
                            {player.scores.filter(s => s.holeNumber > 9).reduce((sum, score) => sum + (score?.netScore || 0), 0)}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-gray-200 bg-gray-100">
                    <td className="sticky left-0 z-30 px-2 py-2 text-right text-sm font-bold bg-gray-100 after:absolute after:inset-0 after:bg-gray-100" colSpan={3}>
                      <div className="relative z-10">Total</div>
                    </td>
                    {players.map((player) => (
                      <td key={player.playerID} className="px-1 py-1 text-sm">
                        <div className="flex space-x-1 pr-2">
                          <div className="w-8 py-1 text-right text-sm text-gray-900">
                            {player.scores.reduce((sum, score) => sum + (score?.grossScore || 0), 0)}
                          </div>
                          <div className="w-8 py-1 text-right text-sm text-gray-900">
                            {player.scores.reduce((sum, score) => sum + (score?.netScore || 0), 0)}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showJunkList && selectedScore && (
        <JunkListPopup
          junks={junks}
          selectedJunks={selectedScore.junks}
          onClose={() => {
            setShowJunkList(false);
            setSelectedScore(null);
          }}
          onSave={handleSaveJunks}
        />
      )}
    </>
  );
}

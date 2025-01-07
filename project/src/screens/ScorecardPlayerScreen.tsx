import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fetchScorecardPlayerList } from '../api/scorecardApi';
import type { Player } from '../types/scorecard';

interface ScorecardPlayerScreenProps {
  gameId: string;
  scorecardId: string;
  onBack: () => void;
}

export function ScorecardPlayerScreen({ gameId, scorecardId, onBack }: ScorecardPlayerScreenProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlayers() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchScorecardPlayerList(gameId, scorecardId);
        setPlayers(data.players);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load players');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayers();
  }, [gameId, scorecardId]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading players...</div>;
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
        <h2 className="text-2xl font-bold text-gray-900">Players</h2>
      </div>

      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.playerID} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{player.firstName} {player.lastName}</h4>
                <p className="text-sm text-gray-600">Handicap: {player.handicap}</p>
                <p className="text-sm text-gray-600">{player.tee.name} tees</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Gross: {player.scores.reduce((sum, score) => sum + score.grossScore, 0)}</p>
                <p className="text-sm font-medium">Net: {player.scores.reduce((sum, score) => sum + score.netScore, 0)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button 
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Start Scoring
        </button>
      </div>
    </div>
  );
}
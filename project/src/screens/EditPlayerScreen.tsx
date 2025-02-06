import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { updatePlayer, addGamePlayerByName } from '../api/playerApi';
import { SelectTeeScreen } from './SelectTeeScreen';
import type { Player, Tee } from '../types/player';
import type { Game } from '../types/game';

interface EditPlayerScreenProps {
  player?: Player;
  game: Game;
  groupId: string;
  onBack: () => void;
  onSave: (updatedPlayer: Player) => void;
  defaultTee?: Tee | null;
  isNewPlayer?: boolean;
}

export function EditPlayerScreen({ 
  player, 
  game, 
  groupId, 
  onBack, 
  onSave,
  defaultTee,
  isNewPlayer = false
}: EditPlayerScreenProps) {
  const [firstName, setFirstName] = useState(player?.firstName || '');
  const [lastName, setLastName] = useState(player?.lastName || '');
  const [handicap, setHandicap] = useState(player?.handicap || '');
  const [selectedTee, setSelectedTee] = useState<Tee | null>(player?.tee || defaultTee || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTeeSelection, setShowTeeSelection] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isNewPlayer) {
        // Add new player
        const response = await addGamePlayerByName({
          gameID: game.gameID,
          groupID: groupId,
          firstName,
          lastName,
          handicap: handicap ? parseInt(handicap, 10) : null,
          teeID: selectedTee?.teeID || '',
          didPay: 0,
          venmoName: null,
        });

        // Create a player object from the response
        const newPlayer: Player = {
          playerID: response.playerID,
          firstName,
          lastName,
          handicap: handicap || null,
          tee: selectedTee || undefined,
          venmoName: null,
          didPay: '0',
          scores: []
        };
        onSave(newPlayer);
      } else if (player) {
        // Update existing player
        const response = await updatePlayer({
          playerID: player.playerID,
          gameID: game.gameID,
          groupID: groupId,
          firstName,
          lastName,
          handicap: handicap ? parseInt(handicap, 10) : null,
          teeID: selectedTee?.teeID || '',
          didPay: parseInt(player.didPay, 10) || 0,
          venmoName: player.venmoName,
        });

        if (response.status.code === 0) {
          const updatedPlayer = {
            ...player,
            firstName,
            lastName,
            handicap,
            tee: selectedTee || undefined,
          };
          onSave(updatedPlayer);
        } else {
          throw new Error(response.status.message);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save player');
      setIsSubmitting(false);
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow letters, numbers, spaces, and apostrophes
    if (/^[a-zA-Z0-9 ']*$/.test(value)) {
      setFirstName(value);
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow letters, numbers, spaces, and apostrophes
    if (/^[a-zA-Z0-9 ']*$/.test(value)) {
      setLastName(value);
    }
  };

  const handleHandicapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow numbers and a single minus sign at the start
    if (/^-?\d*$/.test(value)) {
      setHandicap(value);
    }
  };

  const handleTeeSelect = (tee: Tee) => {
    setSelectedTee(tee);
    setShowTeeSelection(false);
  };

  if (showTeeSelection) {
    return (
      <SelectTeeScreen
        courseId={game.courseID}
        onBack={() => setShowTeeSelection(false)}
        onSelect={handleTeeSelect}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {isNewPlayer ? 'Add Player' : 'Edit Player'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="handicap" className="block text-sm font-medium text-gray-700">
              Handicap
            </label>
            <input
              type="text"
              id="handicap"
              value={handicap}
              onChange={handleHandicapChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tee
            </label>
            <button
              type="button"
              onClick={() => setShowTeeSelection(true)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selectedTee ? (
                <div>
                  <div className="font-medium">{selectedTee.name}</div>
                  <div className="text-sm text-gray-500">
                    Slope: {selectedTee.slope} • Rating: {selectedTee.rating}
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Select a tee</span>
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Saving...' : isNewPlayer ? 'Add Player' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
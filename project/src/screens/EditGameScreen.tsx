import { ArrowLeft } from 'lucide-react';
import type { Game } from '../types/game';

interface EditGameScreenProps {
  game: Game;
  onBack: () => void;
}

export function EditGameScreen({ game, onBack }: EditGameScreenProps) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 ml-4">Edit Game</h2>
      </div>
      
      <div className="max-w-sm mx-auto">
        <p className="text-gray-600 text-center">Game editing coming soon...</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Current Game Details:</h3>
          <p className="text-sm text-gray-600">Name: {game.name}</p>
          <p className="text-sm text-gray-600">Course: {game.courseName}</p>
          <p className="text-sm text-gray-600">Type: {game.teamPlayerType}</p>
          <p className="text-sm text-gray-600">Date: {game.date}</p>
        </div>
      </div>
    </div>
  );
} 
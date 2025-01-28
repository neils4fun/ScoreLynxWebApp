import { ArrowLeft } from 'lucide-react';
import type { Game } from '../types/game';

interface GamePlayersScreenProps {
  game: Game;
  onBack: () => void;
}

export function GamePlayersScreen({ onBack }: GamePlayersScreenProps) {
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
      
      {/* Add your players screen content here */}
    </div>
  );
} 
import { ArrowLeft } from 'lucide-react';
import type { Game } from '../types/game';

interface GameTeamsScreenProps {
  game: Game;
  onBack: () => void;
}

export function GameTeamsScreen({ onBack }: GameTeamsScreenProps) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
      </div>
      
      {/* Add your teams screen content here */}
    </div>
  );
} 
import { ArrowLeft } from 'lucide-react';

interface NewGameScreenProps {
  onBack: () => void;
}

export function NewGameScreen({ onBack }: NewGameScreenProps) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 ml-4">New Game</h2>
      </div>
      
      <div className="max-w-sm mx-auto">
        <p className="text-gray-600 text-center">Game creation coming soon...</p>
      </div>
    </div>
  );
} 
import { Trophy } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Trophy className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Golf Leaderboard</h1>
      <p className="text-gray-600">Search for players and view their standings</p>
    </div>
  );
}
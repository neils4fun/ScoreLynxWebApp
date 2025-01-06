import { PlusCircle } from 'lucide-react';

export function ScorecardScreen() {
  return (
    <div className="p-4">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scorecard</h2>
        <p className="text-gray-600 mb-8">Select a game to view its scorecard or create a new one</p>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="w-5 h-5 mr-2" />
          New Scorecard
        </button>
      </div>
    </div>
  );
}
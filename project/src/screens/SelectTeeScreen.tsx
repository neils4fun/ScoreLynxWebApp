import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { fetchTeesForCourse } from '../api/playerApi';
import type { Tee } from '../types/player';

interface SelectTeeScreenProps {
  courseId: string;
  onBack: () => void;
  onSelect: (tee: Tee) => void;
}

export function SelectTeeScreen({ courseId, onBack, onSelect }: SelectTeeScreenProps) {
  const [tees, setTees] = useState<Tee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTees = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetchTeesForCourse(courseId);
      setTees(response.tees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tees');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadTees().finally(() => setIsLoading(false));
  }, [courseId]);

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
          <h2 className="text-2xl font-bold text-gray-900">Select Tee</h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={loadTees}
              disabled={isRefreshing}
              className={`p-2 hover:bg-gray-100 rounded-full
                ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
                transition-transform active:scale-95`}
            >
              <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading tees...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-200">
              {tees.map((tee) => (
                <div
                  key={tee.teeID}
                  onClick={() => onSelect(tee)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {tee.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Slope: {tee.slope} • Rating: {tee.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
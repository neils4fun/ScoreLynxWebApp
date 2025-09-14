import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fetchJunkInformation } from '../api/scorecardApi';
import type { Junk } from '../types/scorecard';

interface JunkInformationScreenProps {
  onBack: () => void;
}

export default function JunkInformationScreen({ onBack }: JunkInformationScreenProps) {
  const [junkList, setJunkList] = useState<Junk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJunkInformation = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchJunkInformation();
        setJunkList(response.junks);
      } catch (err) {
        console.error('Error loading junk information:', err);
        setError(err instanceof Error ? err.message : 'Failed to load junk information');
      } finally {
        setIsLoading(false);
      }
    };

    loadJunkInformation();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold ml-4">Junk Information</h1>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-600">Loading junk information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold ml-4">Junk Information</h1>
        </div>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold ml-4">Junk Information</h1>
      </div>
      
      <div className="space-y-4">
        {junkList.map((junk, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="mb-3">
              <div className="text-lg text-gray-900">
                <span className="font-bold">Junk:</span> {junk.junkName}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-sm text-gray-700">
                <span className="font-bold">Value:</span> {junk.value}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-bold">Description:</span>
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-line">
                {junk.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

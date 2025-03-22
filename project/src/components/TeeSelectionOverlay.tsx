import { X } from 'lucide-react';

interface Tee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
  pars: number[];
  handicaps: number[];
}

interface TeeSelectionOverlayProps {
  tees: Tee[];
  onSelect: (tee: Tee) => void;
  onClose: () => void;
}

export default function TeeSelectionOverlay({ tees, onSelect, onClose }: TeeSelectionOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Select Tee</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
          <ul className="divide-y divide-gray-200">
            {tees.map((tee) => (
              <li
                key={tee.teeID}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(tee)}
              >
                <div className="font-medium">{tee.name}</div>
                <div className="text-sm text-gray-500">
                  Slope: {tee.slope} | Rating: {tee.rating}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 
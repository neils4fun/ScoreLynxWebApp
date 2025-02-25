import { useState } from 'react';
import { Junk } from '../../types/scorecard';

interface JunkListPopupProps {
  junks: Junk[];
  selectedJunks?: Junk[];
  onClose: () => void;
  onSave: (selectedJunks: Junk[]) => void;
}

export function JunkListPopup({ junks, selectedJunks = [], onClose, onSave }: JunkListPopupProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedJunks.map(j => j.junkID))
  );

  const handleToggle = (junkId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(junkId)) {
      newSelected.delete(junkId);
    } else {
      newSelected.add(junkId);
    }
    setSelected(newSelected);
  };

  const handleSave = () => {
    const selectedJunks = junks.filter(junk => selected.has(junk.junkID));
    onSave(selectedJunks);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Select Junks</h3>
        </div>
        <div className="max-h-96 overflow-y-auto p-4">
          <div className="space-y-2">
            {junks.map((junk) => (
              <div
                key={junk.junkID}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <label className="flex items-center space-x-3 w-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.has(junk.junkID)}
                    onChange={() => handleToggle(junk.junkID)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {junk.junkName}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 
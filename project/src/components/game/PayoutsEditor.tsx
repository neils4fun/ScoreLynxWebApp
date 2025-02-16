import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface PayoutsEditorProps {
  onBack: () => void;
  onSave: (payouts: number[]) => void;
  initialPayouts?: number[];
}

export function PayoutsEditor({ onBack, onSave, initialPayouts }: PayoutsEditorProps) {
  const [payouts, setPayouts] = useState<number[]>(() => {
    // Sort initial payouts in descending order if they exist
    return initialPayouts ? [...initialPayouts].sort((a, b) => b - a) : [];
  });
  const [showPicker, setShowPicker] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate remaining percentage
  const total = payouts.reduce((sum, payout) => sum + payout, 0);
  const remaining = 100 - total;

  // Handle adding or updating a payout
  const handlePayoutSelect = (value: number) => {
    if (selectedIndex !== null) {
      // Update existing payout
      setPayouts(prev => {
        const newPayouts = [...prev];
        newPayouts[selectedIndex] = value;
        return newPayouts.sort((a, b) => b - a);
      });
    } else {
      // Add new payout
      setPayouts(prev => [...prev, value].sort((a, b) => b - a));
    }
    setShowPicker(false);
    setSelectedIndex(null);
  };

  // Handle removing a payout
  const handleRemovePayout = (index: number) => {
    setPayouts(prev => prev.filter((_, i) => i !== index));
  };

  // Handle editing a payout
  const handleEditPayout = (index: number) => {
    setSelectedIndex(index);
    setShowPicker(true);
  };

  // Handle saving payouts
  const handleSave = () => {
    if (total !== 100) {
      setError('Payouts must sum to 100%');
      return;
    }
    onSave(payouts);
  };

  // Generate available values for picker
  const getAvailableValues = () => {
    const currentTotal = payouts.reduce((sum, payout, index) => {
      // Exclude the selected payout when calculating total in edit mode
      if (selectedIndex !== null && index === selectedIndex) return sum;
      return sum + payout;
    }, 0);
    const availableRemaining = 100 - currentTotal;
    return Array.from({ length: availableRemaining }, (_, i) => i + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-sm rounded-lg shadow-xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-blue-500"
            >
              Cancel
            </button>
            <h2 className="text-lg font-semibold">Edit Payouts</h2>
            <button
              onClick={handleSave}
              className={`${total === 100 ? 'text-blue-500' : 'text-gray-300'}`}
              disabled={total !== 100}
            >
              Done
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Payouts list */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {payouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white">
                <div className="flex items-center">
                  <button
                    onClick={() => handleRemovePayout(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="ml-2">Place #{index + 1}</span>
                </div>
                <button 
                  onClick={() => handleEditPayout(index)}
                  className="font-medium hover:bg-gray-100 px-3 py-1 rounded"
                >
                  {payout}%
                </button>
              </div>
            ))}
            {remaining > 0 && (
              <div 
                className="flex items-center p-4 bg-white cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedIndex(null);
                  setShowPicker(true);
                }}
              >
                <div className="flex items-center text-blue-500">
                  <Plus className="w-5 h-5" />
                  <span className="ml-2">Add Payout Place</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Picker modal */}
        {showPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-end pb-16">
            <div className="bg-white w-full rounded-t-xl max-h-[70vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <button 
                  onClick={() => {
                    setShowPicker(false);
                    setSelectedIndex(null);
                  }}
                  className="text-blue-500"
                >
                  Cancel
                </button>
                <h3 className="text-lg font-semibold">
                  {selectedIndex !== null ? 'Edit Payout Percent' : 'Select Payout Percent'}
                </h3>
                <div className="w-16" /> {/* Spacer for alignment */}
              </div>
              <div className="overflow-y-auto">
                {getAvailableValues().map(value => (
                  <button
                    key={value}
                    onClick={() => handlePayoutSelect(value)}
                    className="w-full p-4 text-center hover:bg-gray-50 border-b border-gray-200"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
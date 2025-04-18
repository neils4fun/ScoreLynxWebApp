import { useState, useRef } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface DateRangeSelectorProps {
  onConfirm: (startDate: string | undefined, endDate: string | undefined) => void;
  onCancel: () => void;
}

export function DateRangeSelector({ onConfirm, onCancel }: DateRangeSelectorProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Refs for the date inputs
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    // Convert empty strings to undefined
    const formattedStartDate = startDate ? startDate.replace(/-/g, '') : undefined;
    const formattedEndDate = endDate ? endDate.replace(/-/g, '') : undefined;
    
    onConfirm(formattedStartDate, formattedEndDate);
  };

  // Function to handle date input changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, isStartDate: boolean) => {
    const value = e.target.value;
    if (isStartDate) {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  // Function to trigger date picker
  const triggerDatePicker = (isStartDate: boolean) => {
    const inputRef = isStartDate ? startDateInputRef : endDateInputRef;
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Select Date Range</h2>
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Select a date range for the report (optional)
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                ref={startDateInputRef}
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={startDate}
                onChange={(e) => handleDateChange(e, true)}
              />
              <button 
                type="button"
                className="absolute right-2 top-2.5 p-1 hover:bg-gray-100 rounded-full"
                onClick={() => triggerDatePicker(true)}
              >
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                ref={endDateInputRef}
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={endDate}
                onChange={(e) => handleDateChange(e, false)}
              />
              <button 
                type="button"
                className="absolute right-2 top-2.5 p-1 hover:bg-gray-100 rounded-full"
                onClick={() => triggerDatePicker(false)}
              >
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleConfirm}
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
} 
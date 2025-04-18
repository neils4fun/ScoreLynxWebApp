import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X, Search } from 'lucide-react';

interface DateRangeSelectorProps {
  onConfirm: (startDate: string | undefined, endDate: string | undefined, nameFilter: string | undefined) => void;
  onCancel: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
  initialNameFilter?: string;
}

export function DateRangeSelector({ 
  onConfirm, 
  onCancel, 
  initialStartDate, 
  initialEndDate,
  initialNameFilter
}: DateRangeSelectorProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [nameFilter, setNameFilter] = useState<string>(initialNameFilter || '');
  
  // Refs for the date inputs
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  // Initialize with provided values
  useEffect(() => {
    if (initialStartDate) {
      // Convert YYYYMMDD to YYYY-MM-DD format
      const formattedDate = initialStartDate.replace(
        /(\d{4})(\d{2})(\d{2})/, 
        '$1-$2-$3'
      );
      setStartDate(formattedDate);
    }
    
    if (initialEndDate) {
      // Convert YYYYMMDD to YYYY-MM-DD format
      const formattedDate = initialEndDate.replace(
        /(\d{4})(\d{2})(\d{2})/, 
        '$1-$2-$3'
      );
      setEndDate(formattedDate);
    }
  }, [initialStartDate, initialEndDate]);

  const handleConfirm = () => {
    // Convert empty strings to undefined
    const formattedStartDate = startDate ? startDate.replace(/-/g, '') : undefined;
    const formattedEndDate = endDate ? endDate.replace(/-/g, '') : undefined;
    const formattedNameFilter = nameFilter.trim() || undefined;
    
    onConfirm(formattedStartDate, formattedEndDate, formattedNameFilter);
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

  // Function to handle name filter changes
  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
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
        
        <div className="grid grid-cols-2 gap-4 mb-4">
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
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Player Name (optional)
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md pl-8"
              placeholder="Enter player name"
              value={nameFilter}
              onChange={handleNameFilterChange}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-3" />
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
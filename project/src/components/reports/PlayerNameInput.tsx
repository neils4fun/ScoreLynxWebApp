import { useState } from 'react';
import { X } from 'lucide-react';

interface PlayerNameInputProps {
  onConfirm: (lastName: string, firstName: string) => void;
  onCancel: () => void;
}

export function PlayerNameInput({ onConfirm, onCancel }: PlayerNameInputProps) {
  // Initialize state with values from localStorage if available
  const [lastName, setLastName] = useState(() => {
    const saved = localStorage.getItem('lastPlayerLastName');
    return saved || '';
  });
  
  const [firstName, setFirstName] = useState(() => {
    const saved = localStorage.getItem('lastPlayerFirstName');
    return saved || '';
  });
  
  const [errors, setErrors] = useState<{ lastName?: string; firstName?: string }>({});

  const handleConfirm = () => {
    // Validate inputs
    const newErrors: { lastName?: string; firstName?: string } = {};
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Save the values to localStorage
    localStorage.setItem('lastPlayerLastName', lastName.trim());
    localStorage.setItem('lastPlayerFirstName', firstName.trim());
    
    onConfirm(lastName.trim(), firstName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Enter Player Name</h2>
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
} 
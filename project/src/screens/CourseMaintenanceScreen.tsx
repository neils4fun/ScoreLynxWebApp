import React, { useState } from 'react';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import CourseSelectionScreen from './CourseSelectionScreen';
import TeeSelectionOverlay from '../components/TeeSelectionOverlay';
import { API_BASE, APP_VERSION, APP_SOURCE, DEVICE_ID } from '../api/config';

interface CourseMaintenanceScreenProps {
  onBack: () => void;
}

interface Tee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
  pars: number[];
  handicaps: number[];
}

interface Course {
  courseID: string;
  name: string;
  city: string;
  state: string;
  region: string;
  version: string;
  tees: Tee[] | null;
}

export default function CourseMaintenanceScreen({ onBack }: CourseMaintenanceScreenProps) {
  const [showCourseSelection, setShowCourseSelection] = useState(false);
  const [showTeeSelection, setShowTeeSelection] = useState(false);
  const [formData, setFormData] = useState<Course>({
    courseID: '',
    name: '',
    city: '',
    state: '',
    region: '',
    version: '',
    tees: null
  });
  const [selectedTee, setSelectedTee] = useState<Tee | null>({
    teeID: '',
    name: '',
    slope: 0,
    rating: 0,
    pars: Array(18).fill(0),
    handicaps: Array(18).fill(0)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseSelect = (course: Course) => {
    setFormData(course);
    setShowCourseSelection(false);
  };

  const handleTeeSelect = async (tee: Tee) => {
    try {
      // Fetch hole details for the selected tee
      const response = await fetch(`${API_BASE}/getHolesForTee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: APP_SOURCE,
          appVersion: APP_VERSION,
          deviceID: DEVICE_ID,
          teeID: tee.teeID
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.status.code === 0 && data.holes) {
        // Initialize arrays with 18 elements
        const pars = Array(18).fill(0);
        const handicaps = Array(18).fill(0);

        // Map the hole data to our arrays
        data.holes.forEach((hole: { number: number; par: number; matchPlayHandicap: number }) => {
          const index = hole.number - 1; // Convert 1-based to 0-based index
          pars[index] = hole.par;
          handicaps[index] = hole.matchPlayHandicap;
        });

        const teeWithDetails = {
          ...tee,
          pars,
          handicaps
        };
        setSelectedTee(teeWithDetails);
        setShowTeeSelection(false);
      } else {
        console.error('Failed to fetch hole details:', data.status.message);
      }
    } catch (error) {
      console.error('Error fetching hole details:', error);
      // Initialize with empty arrays if fetch fails
      const initializedTee = {
        ...tee,
        pars: Array(18).fill(0),
        handicaps: Array(18).fill(0)
      };
      setSelectedTee(initializedTee);
      setShowTeeSelection(false);
    }
  };

  const handleTeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTee) return;
    
    const { name, value } = e.target;
    const newTee = { ...selectedTee };
    
    if (name.startsWith('par_')) {
      const holeIndex = parseInt(name.split('_')[1]);
      newTee.pars[holeIndex] = parseInt(value) || 0;
    } else if (name.startsWith('handicap_')) {
      const holeIndex = parseInt(name.split('_')[1]);
      newTee.handicaps[holeIndex] = parseInt(value) || 0;
    } else {
      (newTee[name as keyof Omit<Tee, 'pars' | 'handicaps'>] as string | number) = value;
    }
    
    setSelectedTee(newTee);
  };

  // Add validation function
  const isFormValid = () => {
    // Check course fields
    if (!formData.name || !formData.city || !formData.state || !formData.region) {
      return false;
    }

    // Check tee fields
    if (!selectedTee || !selectedTee.name || !selectedTee.slope || !selectedTee.rating) {
      return false;
    }

    // Check pars and handicaps
    if (!selectedTee.pars || !selectedTee.handicaps) {
      return false;
    }

    // Check if all holes have values
    return selectedTee.pars.every(par => par > 0) && 
           selectedTee.handicaps.every(hdcp => hdcp > 0);
  };

  const handleSubmit = async () => {
    if (!selectedTee) return; // Early return if no tee is selected
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1: Add/Update Course
      const courseResponse = await fetch(`${API_BASE}/addCourse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: APP_SOURCE,
          appVersion: APP_VERSION,
          deviceID: DEVICE_ID,
          name: formData.name,
          version: 1,
          city: formData.city,
          state: formData.state,
          region: formData.region
        })
      });

      if (!courseResponse.ok) {
        const errorText = await courseResponse.text();
        console.error('Course API error response:', errorText);
        throw new Error(`Failed to add/update course: ${errorText}`);
      }

      const courseData = await courseResponse.json();
      
      if (courseData.status.code !== 0) {
        throw new Error(courseData.status.message || 'Failed to add/update course');
      }

      if (!courseData.response?.courseID) {
        throw new Error('No courseID received from server');
      }

      const courseID = courseData.response.courseID;

      // Step 2: Add/Update Tee
      const teePayload = {
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
        courseID,
        name: selectedTee.name,
        slope: selectedTee.slope,
        rating: selectedTee.rating
      };
      
      const teeResponse = await fetch(`${API_BASE}/addTee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teePayload)
      });

      if (!teeResponse.ok) {
        const errorText = await teeResponse.text();
        throw new Error(`Failed to add/update tee: ${errorText}`);
      }

      const teeData = await teeResponse.json();
      if (teeData.status.code !== 0) {
        throw new Error(teeData.status.message || 'Failed to add/update tee');
      }

      if (!teeData.response?.teeID) {
        throw new Error('No teeID received from server');
      }

      const teeID = teeData.response.teeID;

      // Step 3: Add/Update Holes
      for (let i = 0; i < 18; i++) {
        const holePayload = {
          source: APP_SOURCE,
          appVersion: APP_VERSION,
          deviceID: DEVICE_ID,
          teeID,
          number: i + 1,
          par: selectedTee.pars[i],
          hdcp: selectedTee.handicaps[i]
        };
        
        try {
          const response = await fetch(`${API_BASE}/addHole`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(holePayload)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add/update hole ${i + 1}: ${errorText || 'Server error'}`);
          }

          const data = await response.json();
          
          if (data.status.code !== 0) {
            throw new Error(data.status.message || `Failed to add/update hole ${i + 1}`);
          }
        } catch (error) {
          throw error;
        }
      }

      // Success! Clear form or show success message
      setFormData({
        courseID: '',
        name: '',
        city: '',
        state: '',
        region: '',
        version: '',
        tees: null
      });
      setSelectedTee({
        teeID: '',
        name: '',
        slope: 0,
        rating: 0,
        pars: Array(18).fill(0),
        handicaps: Array(18).fill(0)
      });
      alert('Course updated successfully!');

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showCourseSelection) {
    return (
      <CourseSelectionScreen
        onBack={() => setShowCourseSelection(false)}
        onSelectCourse={handleCourseSelect}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Course Maintenance</h1>
      
      <div className="bg-white rounded-lg shadow p-4">
        <form className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowCourseSelection(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Course</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Course City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Course State:
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Course Region:
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Tees</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="teeName" className="block text-sm font-medium text-gray-700 mb-1">
                    Tee Name:
                  </label>
                  <input
                    type="text"
                    id="teeName"
                    name="name"
                    value={selectedTee?.name || ''}
                    onChange={handleTeeInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setShowTeeSelection(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Tees</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="teeSlope" className="block text-sm font-medium text-gray-700 mb-1">
                    Tee Slope:
                  </label>
                  <input
                    type="number"
                    id="teeSlope"
                    name="slope"
                    value={selectedTee?.slope || ''}
                    onChange={handleTeeInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="teeRating" className="block text-sm font-medium text-gray-700 mb-1">
                    Tee Rating:
                  </label>
                  <input
                    type="number"
                    id="teeRating"
                    name="rating"
                    value={selectedTee?.rating || ''}
                    onChange={handleTeeInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Front 9 Header */}
                    <div className="grid grid-cols-[80px_repeat(9,48px)] gap-1 mb-2">
                      <div className="font-medium text-gray-700">Hole:</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`hole_${i}`} className="text-center">
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    {/* Front 9 Pars */}
                    <div className="grid grid-cols-[80px_repeat(9,48px)] gap-1 mb-2">
                      <div className="font-medium text-gray-700">Pars:</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`par_${i}`}>
                          <input
                            type="number"
                            id={`par_${i}`}
                            name={`par_${i}`}
                            value={selectedTee?.pars[i] || ''}
                            onChange={handleTeeInputChange}
                            className="w-full px-1 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Front 9 Handicaps */}
                    <div className="grid grid-cols-[80px_repeat(9,48px)] gap-1 mb-4">
                      <div className="font-medium text-gray-700">Indices:</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`handicap_${i}`}>
                          <input
                            type="number"
                            id={`handicap_${i}`}
                            name={`handicap_${i}`}
                            value={selectedTee?.handicaps[i] || ''}
                            onChange={handleTeeInputChange}
                            className="w-full px-1 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Back 9 Header */}
                    <div className="grid grid-cols-[80px_repeat(9,48px)] gap-1 mb-2">
                      <div className="font-medium text-gray-700">Hole:</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`hole_${i + 9}`} className="text-center">
                          {i + 10}
                        </div>
                      ))}
                    </div>

                    {/* Back 9 Pars */}
                    <div className="grid grid-cols-[80px_repeat(9,48px)] gap-1 mb-2">
                      <div className="font-medium text-gray-700">Pars:</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`par_${i + 9}`}>
                          <input
                            type="number"
                            id={`par_${i + 9}`}
                            name={`par_${i + 9}`}
                            value={selectedTee?.pars[i + 9] || ''}
                            onChange={handleTeeInputChange}
                            className="w-full px-1 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Back 9 Handicaps */}
                    <div className="grid grid-cols-[80px_repeat(9,48px)] gap-1">
                      <div className="font-medium text-gray-700">Indices:</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`handicap_${i + 9}`}>
                          <input
                            type="number"
                            id={`handicap_${i + 9}`}
                            name={`handicap_${i + 9}`}
                            value={selectedTee?.handicaps[i + 9] || ''}
                            onChange={handleTeeInputChange}
                            className="w-full px-1 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add the submit button and error message */}
          <div className="mt-6">
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isFormValid() && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Add/Update Course</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {showTeeSelection && formData.tees && (
        <TeeSelectionOverlay
          tees={formData.tees}
          onSelect={handleTeeSelect}
          onClose={() => setShowTeeSelection(false)}
        />
      )}
    </div>
  );
} 
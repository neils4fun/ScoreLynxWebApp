import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { API_BASE, APP_VERSION, APP_SOURCE, DEVICE_ID } from '../api/config';

interface CourseSelectionScreenProps {
  onBack: () => void;
  onSelectCourse: (course: Course) => void;
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

interface ApiResponse {
  status: {
    code: number;
    message: string;
  };
  courses: Course[];
}

export default function CourseSelectionScreen({ onBack, onSelectCourse }: CourseSelectionScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/getCourseList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: APP_SOURCE,
          appVersion: APP_VERSION,
          deviceID: DEVICE_ID
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ApiResponse = await response.json();
      
      if (data.status.code === 0) {
        setCourses(data.courses);
      } else {
        setError(data.status.message);
      }
    } catch (error) {
      setError('Failed to fetch courses. Please try again.');
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCourseClick = (course: Course) => {
    onSelectCourse(course);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      <h1 className="text-2xl font-bold mb-4">Select Course</h1>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search course name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        ) : (
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto border border-gray-200 rounded-md">
            {filteredCourses.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">No courses found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <li
                    key={course.courseID}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCourseClick(course)}
                  >
                    <div className="font-medium">{course.name}</div>
                    <div className="text-sm text-gray-500">
                      {course.city}, {course.state} - {course.region}
                    </div>
                    {course.tees && course.tees.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        Tees: {course.tees.map(tee => tee.name).join(', ')}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
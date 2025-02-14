import { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { APP_VERSION, APP_SOURCE, DEVICE_ID, API_BASE } from '../../api/config';

interface Course {
  courseID: string;
  name: string;
  city: string;
  state: string;
  tees: Array<{
    teeID: string;
    name: string;
    slope: number;
    rating: number;
  }>;
}

interface Tee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
}

interface RecentCourseTee {
  courseID: string;
  courseName: string;
  teeID: string;
  teeName: string;
}

interface CourseSelectorProps {
  onCancel: () => void;
  onSelect: (courseId: string, courseName: string, teeId: string, teeName: string) => void;
}

export function CourseSelector({ onCancel, onSelect }: CourseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentSelections, setRecentSelections] = useState<RecentCourseTee[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTee, setSelectedTee] = useState<Tee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load recent selections from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentCourseTees');
    if (saved) {
      setRecentSelections(JSON.parse(saved));
    }
  }, []);

  // Search courses when debounced search term changes
  useEffect(() => {
    const searchCourses = async () => {
      if (!debouncedSearchTerm) {
        setCourses([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/getCourseList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            search: debouncedSearchTerm,
            appVersion: APP_VERSION,
            source: APP_SOURCE,
            deviceID: DEVICE_ID
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        
        if (data.status.code === 0) {
          setCourses(data.courses);
        } else {
          throw new Error(data.status.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search courses');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchCourses();
  }, [debouncedSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSelectedCourse(null);
    setSelectedTee(null);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedTee(null);
  };

  const handleTeeSelect = (tee: Tee) => {
    setSelectedTee(tee);
  };

  const handleRecentSelect = (recent: RecentCourseTee) => {
    onSelect(recent.courseID, recent.courseName, recent.teeID, recent.teeName);
  };

  const handleDone = () => {
    if (selectedCourse && selectedTee) {
      // Update recent selections
      const newSelection: RecentCourseTee = {
        courseID: selectedCourse.courseID,
        courseName: selectedCourse.name,
        teeID: selectedTee.teeID,
        teeName: selectedTee.name
      };

      const updatedSelections = [
        newSelection,
        ...recentSelections.filter(
          item => !(item.courseID === selectedCourse.courseID && item.teeID === selectedTee.teeID)
        )
      ].slice(0, 3);

      setRecentSelections(updatedSelections);
      localStorage.setItem('recentCourseTees', JSON.stringify(updatedSelections));

      onSelect(selectedCourse.courseID, selectedCourse.name, selectedTee.teeID, selectedTee.name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md mx-auto h-[90vh] flex flex-col rounded-t-xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 rounded-t-xl">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onCancel}
              className="px-2 py-1 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              disabled={!selectedCourse || !selectedTee}
              className={`px-2 py-1 ${
                selectedCourse && selectedTee
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Done
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Selections */}
          {recentSelections.length > 0 && !searchTerm && (
            <div className="px-3 py-2">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Recent Course/Tee</h2>
              <div className="space-y-1">
                {recentSelections.map((recent) => (
                  <button
                    key={`${recent.courseID}-${recent.teeID}`}
                    onClick={() => handleRecentSelect(recent)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg text-sm"
                  >
                    <span className="text-gray-900">
                      {recent.courseName} / {recent.teeName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {searchTerm && (
            <div className="px-3 py-2 border-t border-gray-200">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Courses</h2>
              {isLoading ? (
                <div className="text-center py-4 text-sm text-gray-500">Loading courses...</div>
              ) : error ? (
                <div className="text-center py-4 text-sm text-red-600">{error}</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">No courses found</div>
              ) : (
                <div className="space-y-1">
                  {courses.map((course) => (
                    <button
                      key={course.courseID}
                      onClick={() => handleCourseSelect(course)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-900">{course.name}</div>
                          <div className="text-xs text-gray-500">
                            {course.city}, {course.state}
                          </div>
                        </div>
                        {selectedCourse?.courseID === course.courseID && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tees */}
          {selectedCourse && (
            <div className="px-3 py-2 border-t border-gray-200">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tees</h2>
              <div className="space-y-1">
                {selectedCourse.tees.map((tee) => (
                  <button
                    key={tee.teeID}
                    onClick={() => handleTeeSelect(tee)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg text-sm flex items-center justify-between"
                  >
                    <div>
                      <div className="text-gray-900">{tee.name}</div>
                      <div className="text-xs text-gray-500">
                        Slope: {tee.slope} • Rating: {tee.rating}
                      </div>
                    </div>
                    {selectedTee?.teeID === tee.teeID && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
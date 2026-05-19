import { API_BASE, APP_VERSION, APP_SOURCE, DEVICE_ID } from './config';

export interface CourseTeeSummary {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
  pars: number[];
  handicaps: number[];
}

interface GetCourseResponse {
  status: {
    code: number;
    message: string;
  };
  course: {
    tees: Array<{
      teeID: string;
      name: string;
      slope: number;
      rating: number;
    }>;
  };
}

export async function fetchCourseTees(courseId: string): Promise<CourseTeeSummary[]> {
  const response = await fetch(`${API_BASE}/getCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseID: courseId,
      deviceID: DEVICE_ID,
      appVersion: APP_VERSION,
      source: APP_SOURCE,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as GetCourseResponse;

  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data.course.tees.map(tee => ({
    teeID: tee.teeID,
    name: tee.name,
    slope: tee.slope,
    rating: tee.rating,
    pars: Array(18).fill(0),
    handicaps: Array(18).fill(0),
  }));
}

interface DeleteTeeRequest {
  teeID: string;
  source: string;
  appVersion: string;
  deviceID: string;
}

interface DeleteTeeResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function deleteTee(teeId: string): Promise<DeleteTeeResponse> {
  const payload: DeleteTeeRequest = {
    teeID: teeId,
    source: APP_SOURCE,
    appVersion: APP_VERSION,
    deviceID: DEVICE_ID,
  };

  const response = await fetch(`${API_BASE}/deleteTee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as DeleteTeeResponse;

  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}

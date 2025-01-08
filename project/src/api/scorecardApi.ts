import { API_BASE } from './config';
import { ScorecardListResponse, ScorecardPlayerListResponse } from '../types/scorecard';
import { CourseResponse } from '../types/course';

export async function fetchScorecardList(gameId: string): Promise<ScorecardListResponse> {
  try {
    const response = await fetch(`${API_BASE}/getScorecardList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: "SLP",
        appVersion: "1.2.0 (0.0.1)",
        deviceID: "arm64",
        gameID: gameId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ScorecardListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching scorecard list:', error);
    throw error;
  }
}

export async function fetchScorecardPlayerList(gameId: string, scorecardId: string): Promise<ScorecardPlayerListResponse> {
  try {
    const response = await fetch(`${API_BASE}/getScorecardPlayerList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceID: "arm64",
        gameID: gameId,
        scorecardID: scorecardId,
        appVersion: "1.2.0 (0.0.1)",
        source: "SLP"
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ScorecardPlayerListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching scorecard player list:', error);
    throw error;
  }
}

export async function fetchCourse(courseId: string): Promise<CourseResponse> {
  try {
    const response = await fetch(`${API_BASE}/getCourse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: "SLP",
        appVersion: "1.2.0 (0.0.1)",
        deviceID: "arm64",
        courseID: courseId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as CourseResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}
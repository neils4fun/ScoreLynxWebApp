import { API_BASE, APP_SOURCE, DEVICE_ID, APP_VERSION } from './config';

// Define types for the tee sheet report response
export interface TeeSheetScore {
  scoreID: string;
  holeNumber: number;
  grossScore: number;
  netScore: number;
}

export interface TeeSheetPlayer {
  playerID: string;
  firstName: string;
  lastName: string;
  handicap: string;
  venmoName: string | null;
  tee: {
    teeID: string;
    name: string;
    slope: number;
    rating: number;
  };
  scores: TeeSheetScore[];
}

export interface TeeSheetScorecard {
  name: string;
  players: TeeSheetPlayer[];
}

export interface TeeSheetReportResponse {
  status: {
    code: number;
    message: string;
  };
  courseName: string;
  teeName: string;
  gameType: string;
  skinType: string;
  scorecards: TeeSheetScorecard[];
}

/**
 * Fetches the tee sheet report for a specific game
 * @param gameId The ID of the game to get the tee sheet for
 * @returns Promise with the tee sheet report data
 */
export async function getTeeSheetReport(gameId: string): Promise<TeeSheetReportResponse> {
  try {
    const response = await fetch(`${API_BASE}/getTeeSheetReport`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameID: gameId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tee sheet report');
    }

    const data = await response.json();
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to fetch tee sheet report');
    }

    return data;
  } catch (error) {
    console.error('Error fetching tee sheet report:', error);
    throw error;
  }
} 
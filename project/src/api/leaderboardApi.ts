import { API_BASE, APP_VERSION, APP_SOURCE, DEVICE_ID } from './config';
import { 
  MatchplayResponse, 
  TeamLeaderboardResponse, 
  PlayerLeaderboardResponse, 
  SkinsResponse, 
  PayoutsResponse 
} from '../types/leaderboard';

interface SkinsDetailRequest {
  gameID: string;
  gameHole: number;
  skinsType: 'Net' | 'Gross';
  appVersion?: string;
  deviceID?: string;
  source?: string;
}

export interface SkinPlayer {
  gameID: string;
  type: 'Net' | 'Gross';
  gross: number;
  score: string;
  holeNumber: number;
  playerID: string;
  firstName: string;
  lastName: string;
}

interface SkinsDetailResponse {
  status: {
    code: number;
    message: string;
  };
  skins: SkinPlayer[];
}

export async function fetchMatchplayLeaderboard(gameId: string): Promise<MatchplayResponse> {
  try {
    const response = await fetch(`${API_BASE}/getMatchplayLeaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gameID: gameId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as MatchplayResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching matchplay leaderboard:', error);
    throw error;
  }
}

export async function fetchTeamLeaderboard(gameId: string): Promise<TeamLeaderboardResponse> {
  try {
    const response = await fetch(`${API_BASE}/getTeamLeaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gameID: gameId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as TeamLeaderboardResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching team leaderboard:', error);
    throw error;
  }
}

export async function fetchPlayerLeaderboard(gameId: string): Promise<PlayerLeaderboardResponse> {
  try {
    const response = await fetch(`${API_BASE}/getPlayerLeaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gameID: gameId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as PlayerLeaderboardResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching player leaderboard:', error);
    throw error;
  }
}

export async function fetchSkins(gameId: string): Promise<SkinsResponse> {
  try {
    const response = await fetch(`${API_BASE}/getSkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appVersion: APP_VERSION,
        source: APP_SOURCE,
        gameID: gameId,
        deviceID: DEVICE_ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as SkinsResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching skins:', error);
    throw error;
  }
}

export async function fetchPayouts(gameId: string): Promise<PayoutsResponse> {
  try {
    const response = await fetch(`${API_BASE}/getPayoutsLeaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameID: gameId,
        deviceID: DEVICE_ID,
        appVersion: APP_VERSION,
        source: APP_SOURCE
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as PayoutsResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching payouts:', error);
    throw error;
  }
}

export async function fetchSkinsDetail(params: SkinsDetailRequest): Promise<SkinsDetailResponse> {
  const response = await fetch(`${API_BASE}/getSkinsDetail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
      source: APP_SOURCE
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as SkinsDetailResponse;
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}
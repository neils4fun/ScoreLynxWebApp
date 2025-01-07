import { API_BASE } from './config';
import { 
  MatchplayResponse, 
  TeamLeaderboardResponse, 
  PlayerLeaderboardResponse, 
  SkinsResponse, 
  PayoutsResponse 
} from '../types/leaderboard';

export async function fetchMatchplayLeaderboard(gameId: string): Promise<MatchplayResponse> {
  try {
    const response = await fetch(`${API_BASE}/getMatchplayLeaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameID: gameId }),
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
      body: JSON.stringify({ gameID: gameId }),
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
      body: JSON.stringify({ gameID: gameId }),
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
        appVersion: "1.2.0 (0.0.1)",
        source: "SLP",
        gameID: gameId,
        deviceID: "arm64"
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
        deviceID: "arm64",
        appVersion: "1.2.0 (0.0.1)",
        source: "SLP"
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
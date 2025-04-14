import { API_BASE, APP_SOURCE, DEVICE_ID, APP_VERSION } from './config';
import type { Player } from '../types/player';

interface AddScorecardPlayerResponse {
  status: {
    code: number;
    message: string;
  };
  scorecardPlayerID: string;
  scorecardID: string;
}

interface GamePlayerListResponse {
  status: {
    code: number;
    message: string;
  };
  players: Player[];
}

export async function addScorecardPlayer(
  gameId: string,
  scorecardId: string,
  playerId: string
): Promise<AddScorecardPlayerResponse> {
  const response = await fetch(`${API_BASE}/addScorecardPlayerByID`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scorecardID: scorecardId,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
      source: APP_SOURCE,
      playerID: playerId,
      gameID: gameId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add player to scorecard');
  }

  return response.json();
}

export async function removeScorecardPlayer(
  scorecardId: string,
  playerId: string,
  gameId: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/removeScorecardPlayerByID`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scorecardID: scorecardId,
      playerID: playerId,
      gameID: gameId,
      appVersion: APP_VERSION,
      source: APP_SOURCE,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove player from scorecard');
  }
}

export async function fetchGamePlayerList(gameId: string): Promise<GamePlayerListResponse> {
  const response = await fetch(`${API_BASE}/getGamePlayerList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameID: gameId,
      appVersion: APP_VERSION,
      source: APP_SOURCE,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch game players');
  }

  return response.json();
}

interface UpdatePlayerRequest {
  playerID: string;
  gameID: string;
  groupID: string;
  firstName: string;
  lastName: string;
  handicap: number | null;
  teeID: string;
  didPay: number;
  venmoName: string | null;
  source?: string;
  appVersion?: string;
  deviceID?: string;
}

interface UpdatePlayerResponse {
  status: {
    code: number;
    message: string;
  };
  playerID: string;
}

export async function updatePlayer(params: UpdatePlayerRequest): Promise<UpdatePlayerResponse> {
  const response = await fetch(`${API_BASE}/updatePlayer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      source: APP_SOURCE,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update player');
  }

  return response.json();
}

interface Tee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
}

interface GetTeesForCourseResponse {
  status: {
    code: number;
    message: string;
  };
  tees: Tee[];
}

export async function fetchTeesForCourse(courseId: string): Promise<GetTeesForCourseResponse> {
  const response = await fetch(`${API_BASE}/getTeesForCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseID: courseId,
      appVersion: APP_VERSION,
      source: APP_SOURCE,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tees');
  }

  return response.json();
}

interface GroupPlayerListResponse {
  status: {
    code: number;
    message: string;
  };
  players: Player[];
}

export async function fetchGroupPlayerList(gameId: string): Promise<GroupPlayerListResponse> {
  const response = await fetch(`${API_BASE}/getGroupPlayerList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameID: gameId,
      appVersion: APP_VERSION,
      source: APP_SOURCE,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch group players');
  }

  return response.json();
}

interface AddGamePlayerByNameRequest {
  gameID: string;
  groupID: string;
  firstName: string;
  lastName: string;
  handicap: number | null;
  teeID: string;
  didPay: number;
  venmoName: string | null;
  source?: string;
  appVersion?: string;
  deviceID?: string;
}

interface AddGamePlayerByNameResponse {
  status: {
    code: number;
    message: string;
  };
  playerID: string;
}

export async function addGamePlayerByName(params: AddGamePlayerByNameRequest): Promise<AddGamePlayerByNameResponse> {
  try {
    const response = await fetch(`${API_BASE}/addGamePlayerByName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to add player');
    }

    const data = await response.json() as AddGamePlayerByNameResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
}

interface DeleteGamePlayerResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function deleteGamePlayer(
  playerId: string,
  gameId: string
): Promise<DeleteGamePlayerResponse> {
  const response = await fetch(`${API_BASE}/deleteGamePlayer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerID: playerId,
      gameID: gameId,
      source: APP_SOURCE,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete player');
  }

  const data = await response.json();
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message || 'Failed to delete player');
  }

  return data;
}

interface PlayerScoresResponse {
  status: {
    code: number;
    message: string;
  };
  player: {
    playerID: string;
    firstName: string;
    lastName: string;
    handicap: string;
    tee: {
      teeID: string;
      name: string;
      slope: number;
      rating: number;
    };
    scores: Array<{
      scoreID: string;
      holeNumber: number;
      grossScore: number;
      netScore: number;
    }>;
  };
}

export async function fetchPlayerScores(
  gameId: string,
  playerId: string
): Promise<PlayerScoresResponse> {
  try {
    const response = await fetch(`${API_BASE}/getPlayerScores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameID: gameId,
        playerID: playerId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch player scores');
    }

    const data = await response.json();
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to fetch player scores');
    }

    return data;
  } catch (err) {
    console.error('Error fetching player scores:', err);
    throw err;
  }
} 
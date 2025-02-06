import { API_BASE, APP_SOURCE, DEVICE_ID, APP_VERSION } from './config';
import type { Player } from '../types/player';

interface GamePlayerExScorecardListResponse {
  status: {
    code: number;
    message: string;
  };
  players: Player[];
}

export async function fetchGamePlayerExScorecardList(gameId: string): Promise<GamePlayerExScorecardListResponse> {
  const response = await fetch(`${API_BASE}/getGamePlayerExScorecardList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deviceID: DEVICE_ID,
      source: APP_SOURCE,
      gameID: gameId,
      appVersion: APP_VERSION,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch available players');
  }

  return response.json();
}

interface AddScorecardPlayerResponse {
  status: {
    code: number;
    message: string;
  };
  scorecardPlayerID: string;
  scorecardID: string;
  playerID: string;
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

interface RemoveScorecardPlayerResponse {
  status: {
    code: number;
    message: string;
  };
  scorecardID: string;
  playerID: string;
}

export async function removeScorecardPlayer(
  scorecardId: string,
  playerId: string
): Promise<RemoveScorecardPlayerResponse> {
  const response = await fetch(`${API_BASE}/removeScorecardPlayerByID`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deviceID: DEVICE_ID,
      playerID: playerId,
      source: APP_SOURCE,
      scorecardID: scorecardId,
      appVersion: APP_VERSION,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove player from scorecard');
  }

  return response.json();
}

interface GamePlayerListResponse {
  status: {
    code: number;
    message: string;
  };
  players: Player[];
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
    console.log('Adding player with params:', params);
    
    const response = await fetch(`${API_BASE}/addGamePlayerByName`, {
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

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok || data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to add player to game');
    }

    return data;
  } catch (err) {
    console.error('Error adding player:', err);
    throw err;
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
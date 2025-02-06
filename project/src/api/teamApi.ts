import { API_BASE, APP_SOURCE, DEVICE_ID, APP_VERSION } from './config';
import type { Team } from '../types/team';
import type { Player } from '../types/player';

interface TeamListResponse {
  status: {
    code: number;
    message: string;
  };
  teams: Team[];
}

export async function fetchTeamList(gameId: string): Promise<TeamListResponse> {
  const response = await fetch(`${API_BASE}/getTeamList`, {
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
    throw new Error('Failed to fetch teams');
  }

  return response.json();
}

interface TeamPlayerListResponse {
  status: {
    code: number;
    message: string;
  };
  players: Player[];
}

export async function fetchTeamPlayerList(teamId: string): Promise<TeamPlayerListResponse> {
  const response = await fetch(`${API_BASE}/getTeamPlayerList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      teamID: teamId,
      appVersion: APP_VERSION,
      source: APP_SOURCE,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch team players');
  }

  return response.json();
}

interface DeleteTeamPlayerResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function deleteTeamPlayer(
  teamId: string,
  playerId: string
): Promise<DeleteTeamPlayerResponse> {
  const response = await fetch(`${API_BASE}/deleteTeamPlayer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      teamID: teamId,
      playerID: playerId,
      source: APP_SOURCE,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete team player');
  }

  const data = await response.json();
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message || 'Failed to delete team player');
  }

  return data;
}

interface AddTeamPlayerResponse {
  status: {
    code: number;
    message: string;
  };
  playerID: string;
}

interface AddTeamPlayerRequest {
  teamID: string;
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

export async function addTeamPlayerByName(
  teamId: string,
  player: {
    firstName: string;
    lastName: string;
    handicap: string | null;
    teeID?: string;
  }
): Promise<AddTeamPlayerResponse> {
  try {
    console.log('Adding player to team with params:', { teamId, player });
    
    const payload: AddTeamPlayerRequest = {
      teamID: teamId,
      firstName: player.firstName,
      lastName: player.lastName,
      handicap: player.handicap ? parseInt(player.handicap) : null,
      teeID: player.teeID || '',
      didPay: 0,
      venmoName: null,
      source: APP_SOURCE,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
    };
    
    console.log('Request payload:', payload);
    
    const response = await fetch(`${API_BASE}/addTeamPlayerByName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Network error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (data.status.code !== 0) {
      console.error('API error:', data.status);
      throw new Error(`API error: ${data.status.message || 'Unknown error'} (code: ${data.status.code})`);
    }

    return data;
  } catch (err) {
    console.error('Error in addTeamPlayerByName:', err);
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error('Unknown error occurred while adding team player');
    }
  }
} 
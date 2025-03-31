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

interface AddTeamPlayerParams {
  firstName: string;
  lastName: string;
  handicap: string | null;
  teeID?: string;
  venmoName?: string | null;
  didPay?: string;
}

export async function addTeamPlayerByName(teamId: string, player: AddTeamPlayerParams): Promise<AddTeamPlayerResponse> {
  try {
    const payload = {
      teamID: teamId,
      firstName: player.firstName,
      lastName: player.lastName,
      handicap: player.handicap ? parseInt(player.handicap) : null,
      teeID: player.teeID || '',
      didPay: player.didPay ? parseInt(player.didPay) : 0,
      venmoName: player.venmoName || null,
      deviceID: DEVICE_ID,
      source: APP_SOURCE,
      appVersion: APP_VERSION
    };

    const response = await fetch(`${API_BASE}/addTeamPlayerByName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to add player to team');
    }

    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to add player to team');
  }
}

interface TeamScoresResponse {
  status: {
    code: number;
    message: string;
  };
  players: Array<{
    playerID: string;
    firstName: string;
    lastName: string;
    handicap?: string;
    venmoName: string | null;
    didPay: string;
    tee?: {
      teeID: string;
      name: string;
      slope: number;
      rating: number;
    };
    scores: Array<{
      scoreID?: string;
      holeNumber: number;
      grossScore: number;
      netScore: number;
    }>;
  }>;
}

export async function fetchTeamScores(teamId: string): Promise<TeamScoresResponse> {
  try {
    const response = await fetch(`${API_BASE}/getTeamScores?teamID=${teamId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to fetch team scores');
    }

    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to fetch team scores');
  }
} 
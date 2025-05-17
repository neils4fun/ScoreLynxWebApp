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

interface AddTeamPlayerRequest {
  firstName: string;
  lastName: string;
  handicap: number | null;
  teeID: string;
  email: string | null;
}

interface AddTeamPlayerResponse {
  status: {
    code: number;
    message: string;
  };
  playerID: string;
}

export async function addTeamPlayerByName(
  teamId: string, 
  player: AddTeamPlayerRequest
): Promise<AddTeamPlayerResponse> {
  try {
    const response = await fetch(`${API_BASE}/addTeamPlayerByName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamID: teamId,
        firstName: player.firstName,
        lastName: player.lastName,
        handicap: player.handicap || 0,
        teeID: player.teeID || '',
        email: player.email || null,
        didPay: 0,
        venmoName: null,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add player to team');
    }

    const data = await response.json();
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to add player to team');
    }

    return data;
  } catch (error) {
    console.error('Error adding player to team:', error);
    throw error;
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

export async function fetchTeamScores(
  gameId: string,
  teamId: string
): Promise<TeamScoresResponse> {
  try {
    const response = await fetch(`${API_BASE}/getTeamScores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameID: gameId,
        teamID: teamId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team scores');
    }

    const data = await response.json();
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to fetch team scores');
    }

    return data;
  } catch (err) {
    console.error('Error fetching team scores:', err);
    throw err;
  }
}

interface AddTeamResponse {
  status: {
    code: number;
    message: string;
  };
  teamID: string;
}

export async function addTeam(gameId: string, teamName: string): Promise<AddTeamResponse> {
  try {
    const response = await fetch(`${API_BASE}/addTeam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameID: gameId,
        teamName: teamName,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as AddTeamResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error adding team:', error);
    throw error;
  }
}

interface DeleteTeamResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function deleteTeam(teamId: string): Promise<DeleteTeamResponse> {
  try {
    const response = await fetch(`${API_BASE}/deleteTeam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamID: teamId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete team');
    }

    const data = await response.json();
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message || 'Failed to delete team');
    }

    return data;
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
} 
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
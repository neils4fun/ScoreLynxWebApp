import { API_BASE, APP_SOURCE, DEVICE_ID, APP_VERSION } from './config';
import type { Team } from '../types/team';

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
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
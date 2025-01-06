import { APIResponse, GolfGroup, Game, MatchplayResponse } from '../types/api';

const API_BASE = '/slp/sggolfjson.php';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export async function fetchGolfGroups(searchTerm: string = 'test'): Promise<GolfGroup[]> {
  try {
    const response = await fetch(`${API_BASE}/getGroupList`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ search: searchTerm }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as APIResponse<GolfGroup>;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data.groups;
  } catch (error) {
    console.error('Error fetching golf groups:', error);
    throw error;
  }
}

export async function fetchGroupGames(groupId: string): Promise<Game[]> {
  try {
    const response = await fetch(`${API_BASE}/getGameList`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ groupID: groupId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as APIResponse<Game>;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data.games || [];
  } catch (error) {
    console.error('Error fetching group games:', error);
    throw error;
  }
}

export async function fetchMatchplayLeaderboard(gameId: string): Promise<MatchplayResponse> {
  try {
    const response = await fetch(`${API_BASE}/getMatchplayLeaderboard`, {
      method: 'POST',
      headers: defaultHeaders,
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
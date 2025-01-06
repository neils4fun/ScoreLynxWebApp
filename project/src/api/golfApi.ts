import { APIResponse, GolfGroup, Game, MatchplayResponse, TeamLeaderboardResponse, PlayerLeaderboardResponse } from '../types/api';

const API_BASE = '/slp/sggolfjson.php';

export async function fetchGolfGroups(searchTerm: string = 'test'): Promise<GolfGroup[]> {
  try {
    const response = await fetch(`${API_BASE}/getGroupList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
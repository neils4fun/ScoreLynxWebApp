import { APIResponse } from '../types/common';
import { GolfGroup, Game } from '../types/game';
import { API_BASE } from './config';

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
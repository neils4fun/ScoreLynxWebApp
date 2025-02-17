import { APIResponse } from '../types/common';
import { GolfGroup, Game } from '../types/game';
import { GameMetaResponse } from '../types/gameMeta';
import { API_BASE, APP_VERSION, APP_SOURCE, DEVICE_ID } from './config';
import type { SkinsMetaResponse } from '../types/skinsMeta';

interface GameListResponse extends APIResponse<Game> {
  games: Game[];
}

interface AddGameRequest {
  showPaceOfPlay: number;
  strokeOffLow: number;
  groupName: string;
  useGroupHandicaps: number;
  deviceID: string;
  showLeaderBoard: number;
  venmoName: string | null;
  percentHandicap: number;
  addRakeToPayouts: number;
  skinType: string;
  payouts: any[];
  appVersion: string;
  gameKey: string;
  courseID: string;
  mirrorGameID: string | null;
  teeID: string;
  showPayouts: number;
  gameType: string;
  tournamentName: string;
  showSkins: number;
  showNotifications: number;
  round: number;
  teamCount: number;
  source: string;
  skinsAnte: number;
  gameAnte: number;
  ownerDeviceID: string | null;
  teamPlayerType: string;
}

interface AddGameResponse extends APIResponse<any> {
  gameID: number;
}

interface DeleteGameResponse {
  status: {
    code: number;
    message: string;
  };
}

interface UpdateGameRequest {
  gameID: string;
  showPaceOfPlay: number;
  strokeOffLow: number;
  groupName: string;
  useGroupHandicaps: number;
  deviceID: string;
  showLeaderBoard: number;
  venmoName: string | null;
  percentHandicap: number;
  addRakeToPayouts: number;
  skinType: string;
  payouts: any[];
  appVersion: string;
  gameKey: string;
  courseID: string;
  mirrorGameID: string | null;
  teeID: string;
  showPayouts: number;
  gameType: string;
  tournamentName: string;
  showSkins: number;
  showNotifications: number;
  round: number;
  teamCount: number;
  source: string;
  skinsAnte: number;
  gameAnte: number;
  teamPlayerType: string;
  ownerDeviceID: string;
  action?: string;
}

interface UpdateGameResponse {
  status: {
    code: number;
    message: string;
  };
  gameID: number;
}

export interface MirrorableGame {
  gameID: string;
  gameKey: string;
  gameType: string;
  courseName: string;
  teeName: string;
  mirrorGameName: string | null;
  round: number;
  skinsType: string;
}

interface MirrorableGameListResponse {
  status: {
    code: number;
    message: string;
  };
  games: MirrorableGame[];
}

export interface GamePayout {
  payoutID: string;
  payoutName: string;
  gamePayout: number;
  skinsPayout: number;
  totalPayout: number;
}

interface GamePayoutsListResponse {
  status: {
    code: number;
    message: string;
  };
  payouts: number[];
}

export interface Course {
  courseID: string;
  name: string;
  city: string;
  state: string;
  region: string;
  tees: Array<{
    teeID: string;
    name: string;
    slope: number;
    rating: number;
    holes: Array<{
      number: number;
      par: number;
      matchPlayHandicap: number;
    }>;
  }>;
}

interface GetCourseResponse {
  status: {
    code: number;
    message: string;
  };
  course: Course;
}

export async function fetchGolfGroups(searchTerm: string = 'test'): Promise<GolfGroup[]> {
  try {
    const response = await fetch(`${API_BASE}/getGroupList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        search: searchTerm,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID
      }),
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
      body: JSON.stringify({ 
        groupID: groupId,
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as GameListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data.games || [];
  } catch (error) {
    console.error('Error fetching group games:', error);
    throw error;
  }
}

export async function fetchGameMetaList(): Promise<GameMetaResponse> {
  try {
    const response = await fetch(`${API_BASE}/getGameMetaList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
        source: APP_SOURCE
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as GameMetaResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching game meta list:', error);
    throw error;
  }
}

export async function fetchSkinsMetaList(): Promise<SkinsMetaResponse> {
  try {
    const response = await fetch(`${API_BASE}/getSkinsMetaList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
        source: APP_SOURCE
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as SkinsMetaResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching skins meta list:', error);
    throw error;
  }
}

export async function addGame(params: AddGameRequest): Promise<AddGameResponse> {
  try {
    const response = await fetch(`${API_BASE}/addGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as AddGameResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error adding game:', error);
    throw error;
  }
}

export async function deleteGame(gameId: string): Promise<DeleteGameResponse> {
  try {
    const response = await fetch(`${API_BASE}/deleteGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameID: gameId,
        deviceID: DEVICE_ID,
        source: APP_SOURCE,
        appVersion: APP_VERSION
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as DeleteGameResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
}

export async function updateGame(params: UpdateGameRequest): Promise<UpdateGameResponse> {
  try {
    const response = await fetch(`${API_BASE}/updateGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateGame',
        ...params,
        deviceID: DEVICE_ID,
        source: APP_SOURCE,
        appVersion: APP_VERSION
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as UpdateGameResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
}

export async function fetchMirrorableGames(groupId: string, gameKey: string): Promise<MirrorableGame[]> {
  try {
    const response = await fetch(`${API_BASE}/getMirrorableGameList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupID: groupId,
        gameKey: gameKey,
        source: APP_SOURCE,
        deviceID: DEVICE_ID,
        appVersion: APP_VERSION
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as MirrorableGameListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data.games || [];
  } catch (error) {
    console.error('Error fetching mirrorable games:', error);
    throw error;
  }
}

export async function fetchGamePayoutsList(gameId: string): Promise<GamePayoutsListResponse> {
  try {
    const response = await fetch(`${API_BASE}/getGamePayoutsList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameID: gameId,
        source: APP_SOURCE,
        deviceID: DEVICE_ID,
        appVersion: APP_VERSION
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as GamePayoutsListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching game payouts list:', error);
    throw error;
  }
}

export async function fetchCourse(courseId: string): Promise<Course> {
  const response = await fetch(`${API_BASE}/getCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseID: courseId,
      deviceID: DEVICE_ID,
      appVersion: APP_VERSION,
      source: APP_SOURCE,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch course details');
  }

  const data = await response.json() as GetCourseResponse;
  return data.course;
}
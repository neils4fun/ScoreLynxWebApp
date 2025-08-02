import { API_BASE, APP_VERSION, APP_SOURCE, DEVICE_ID } from './config';
import { ScorecardListResponse, ScorecardPlayerListResponse } from '../types/scorecard';
import { CourseResponse } from '../types/course';
import type { Player } from '../types/player';

export async function fetchScorecardList(gameId: string): Promise<ScorecardListResponse> {
  try {
    const response = await fetch(`${API_BASE}/getScorecardList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
        gameID: gameId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ScorecardListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching scorecard list:', error);
    throw error;
  }
}

export async function fetchScorecardPlayerList(gameId: string, scorecardId: string): Promise<ScorecardPlayerListResponse> {
  try {
    const response = await fetch(`${API_BASE}/getScorecardPlayerList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceID: DEVICE_ID,
        gameID: gameId,
        scorecardID: scorecardId,
        appVersion: APP_VERSION,
        source: APP_SOURCE
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ScorecardPlayerListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching scorecard player list:', error);
    throw error;
  }
}

export async function fetchCourse(courseId: string): Promise<CourseResponse> {
  try {
    const response = await fetch(`${API_BASE}/getCourse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: APP_SOURCE,
        appVersion: APP_VERSION,
        deviceID: DEVICE_ID,
        courseID: courseId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as CourseResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}

interface AddHoleScoreRequest {
  playerID: string;
  gameID: string;
  gameHole: number;
  score: number;
  source?: string;
  junkIDs?: number[];
  appVersion?: string;
  deviceID?: string;
}

interface AddHoleScoreResponse {
  status: {
    code: number;
    message: string;
  };
  scoreID: string;
  playerID: string;
  gameID: string;
  gameHole: number;
  score: number;
  net: number;
}

export async function updateScore(
  gameId: string,
  playerId: string,
  holeNumber: number,
  grossScore: number,
  junkIDs?: string[]
): Promise<AddHoleScoreResponse> {
  const payload: AddHoleScoreRequest = {
    playerID: playerId,
    gameID: gameId,
    gameHole: holeNumber,
    score: grossScore,
    source: APP_SOURCE,
    junkIDs: junkIDs?.map(id => parseInt(id)) || [],
    appVersion: APP_VERSION,
    deviceID: DEVICE_ID
  };

  const response = await fetch(`${API_BASE}/addHoleScore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as AddHoleScoreResponse;
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}

interface DeleteHoleScoreRequest {
  scoreID: string;
  deviceID: string;
  source: string;
  appVersion: string;
}

interface DeleteHoleScoreResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function deleteHoleScore(scoreId: string): Promise<DeleteHoleScoreResponse> {
  const payload: DeleteHoleScoreRequest = {
    scoreID: scoreId,
    deviceID: DEVICE_ID,
    source: APP_SOURCE,
    appVersion: APP_VERSION
  };

  const response = await fetch(`${API_BASE}/deleteHoleScore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as DeleteHoleScoreResponse;
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}

interface AddScorecardRequest {
  name: string;
  gameID: string;
  source?: string;
  deviceID?: string;
  appVersion?: string;
}

interface AddScorecardResponse {
  status: {
    code: number;
    message: string;
  };
  scorecard: {
    scorecardID: string;
    name: string;
  };
}

export async function addScorecard(name: string, gameId: string): Promise<AddScorecardResponse> {
  const payload: AddScorecardRequest = {
    name,
    gameID: gameId,
    source: APP_SOURCE,
    deviceID: DEVICE_ID,
    appVersion: APP_VERSION
  };

  const response = await fetch(`${API_BASE}/addScorecard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as AddScorecardResponse;
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}

interface DeleteScorecardRequest {
  scorecardID: string;
  gameID: string;
  source?: string;
  deviceID?: string;
  appVersion?: string;
}

interface DeleteScorecardResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function deleteScorecard(scorecardId: string, gameId: string): Promise<DeleteScorecardResponse> {
  const payload: DeleteScorecardRequest = {
    scorecardID: scorecardId,
    gameID: gameId,
    source: APP_SOURCE,
    deviceID: DEVICE_ID,
    appVersion: APP_VERSION
  };

  const response = await fetch(`${API_BASE}/deleteScorecard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as DeleteScorecardResponse;
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}

interface UpdateScorecardRequest {
  scorecardID: string;
  gameID: string;
  name: string;
  source?: string;
  deviceID?: string;
  appVersion?: string;
}

interface UpdateScorecardResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function updateScorecard(scorecardId: string, gameId: string, name: string): Promise<UpdateScorecardResponse> {
  const payload: UpdateScorecardRequest = {
    scorecardID: scorecardId,
    gameID: gameId,
    name,
    source: APP_SOURCE,
    deviceID: DEVICE_ID,
    appVersion: APP_VERSION
  };

  const response = await fetch(`${API_BASE}/updateScorecard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as UpdateScorecardResponse;
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}

export interface Junk {
  junkID: string;
  junkName: string;
}

interface JunkListResponse {
  status: {
    code: number;
    message: string;
  };
  junks: Junk[];
}

export async function fetchJunkList(): Promise<JunkListResponse> {
  try {
    const response = await fetch(`${API_BASE}/getJunkList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: APP_SOURCE,
        deviceID: DEVICE_ID,
        appVersion: APP_VERSION
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as JunkListResponse;
    
    if (data.status.code !== 0) {
      throw new Error(data.status.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching junk list:', error);
    throw error;
  }
}

interface GamePlayerExScorecardListResponse {
  status: {
    code: number;
    message: string;
  };
  players: Player[];
}

export async function getGamePlayerExScorecardList(gameId: string): Promise<GamePlayerExScorecardListResponse> {
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

interface AutoCreateScorecardsRequest {
  gameID: string;
  strategy: number;
}

interface AutoCreateScorecardsResponse {
  status: {
    code: number;
    message: string;
  };
}

export async function autoCreateScorecards(gameId: string, strategy: number): Promise<AutoCreateScorecardsResponse> {
  const payload: AutoCreateScorecardsRequest = {
    gameID: gameId,
    strategy
  };

  const response = await fetch(`${API_BASE}/autoCreateScorecards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as AutoCreateScorecardsResponse;
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message);
  }

  return data;
}
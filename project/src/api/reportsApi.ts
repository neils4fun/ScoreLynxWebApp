import { API_BASE } from './config';

// Define types for the tee sheet report response
export interface TeeSheetScore {
  scoreID: string;
  holeNumber: number;
  grossScore: number;
  netScore: number;
}

export interface TeeSheetPlayer {
  playerID: string;
  firstName: string;
  lastName: string;
  handicap: string;
  venmoName: string | null;
  email: string | null;
  tee: {
    teeID: string;
    name: string;
    slope: number;
    rating: number;
  };
  scores: TeeSheetScore[];
}

export interface TeeSheetScorecard {
  name: string;
  players: TeeSheetPlayer[];
}

export interface TeeSheetReportResponse {
  status: {
    code: number;
    message: string;
  };
  courseName: string;
  teeName: string;
  gameType: string;
  skinType: string;
  scorecards: TeeSheetScorecard[];
}

// Define types for the group player history report response
export interface GroupPlayerHistoryPlayer {
  Last: string;
  First: string;
  Games: string;
  "avg(handicap)": string;
  "avg(gross)": string;
  "avg(net)": string;
  "avg(place)": string;
  "sum(doubleEagles)": string;
  "sum(eagles)": string;
  "sum(birdies)": string;
  "sum(pars)": string;
  "sum(bogeys)": string;
  "sum(doubleBogeys)": string;
  "sum(others)": string;
}

export interface GroupPlayerHistoryResponse {
  status: {
    code: number;
    message: string;
  };
  results: GroupPlayerHistoryPlayer[];
}

export interface GroupPlayerDetailHistoryResponse {
  status: {
    code: number;
    message: string;
  };
  results: {
    gameKey: string;
    Group: string;
    Last: string;
    First: string;
    handicap: string;
    gross: string;
    points: string;
    quota: string;
    place: string;
    gamePayout: string;
    skinsPayout: string;
    totalPayout: string;
    Net: string;
    doubleEagles: string;
    eagles: string;
    birdies: string;
    pars: string;
    bogeys: string;
    doubleBogeys: string;
    others: string;
  }[];
}

/**
 * Fetches the tee sheet report for a specific game
 * @param gameId The ID of the game to get the tee sheet for
 * @returns Promise with the tee sheet report data
 */
export async function getTeeSheetReport(gameId: string): Promise<TeeSheetReportResponse> {
  const requestBody = {
    gameID: gameId
  };

  const response = await fetch(`${API_BASE}/getTeeSheetReport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tee sheet report');
  }

  return response.json();
}

/**
 * Fetches the group player history report for a specific group
 * @param groupId The ID of the group to get the player history for
 * @param startDate Optional start date in YYYYMMDD format
 * @param endDate Optional end date in YYYYMMDD format
 * @param nameFilter Optional filter to search for players by name
 * @returns Promise with the group player history report data
 */
export async function getGroupPlayerHistoryReport(
  groupId: string,
  startDate?: string,
  endDate?: string,
  nameFilter?: string
): Promise<GroupPlayerHistoryResponse> {
  const requestBody: any = {
    groupID: groupId
  };

  if (startDate) {
    requestBody.startDate = startDate;
  }

  if (endDate) {
    requestBody.endDate = endDate;
  }

  if (nameFilter) {
    requestBody.nameFilter = nameFilter;
  }

  const response = await fetch(`${API_BASE}/getGroupPlayerHistoryReport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch group player history report');
  }

  return response.json();
}

/**
 * Fetches a detailed game-by-game history report for a specific player in a group
 * @param groupId - The ID of the group
 * @param startDate - Optional start date in YYYYMMDD format
 * @param endDate - Optional end date in YYYYMMDD format
 * @param nameFilter - Optional filter to search for a specific player by name
 * @returns Promise with the group player detail history report data
 */
export async function getGroupPlayerDetailHistoryReport(
  groupId: string,
  startDate?: string,
  endDate?: string,
  nameFilter?: string
): Promise<GroupPlayerDetailHistoryResponse> {
  const requestBody: any = {
    groupID: groupId
  };

  if (startDate) {
    requestBody.startDate = startDate;
  }

  if (endDate) {
    requestBody.endDate = endDate;
  }

  if (nameFilter) {
    requestBody.nameFilter = nameFilter;
  }

  const response = await fetch(`${API_BASE}/getGroupPlayerDetailHistoryReport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch group player detail history report');
  }

  return response.json();
}

/**
 * Fetches a player hole by hole history report
 * @param lastName The last name of the player (required)
 * @param firstName The first name of the player (required)
 * @returns The player hole by hole history report data
 * @throws Error if firstName or lastName is empty
 */
export async function getPlayerHoleByHoleHistoryReport(
  lastName: string,
  firstName: string
): Promise<PlayerHoleByHoleHistoryResponse> {
  // Validate that both firstName and lastName are provided
  if (!firstName || !lastName) {
    throw new Error('Both first name and last name are required');
  }

  const requestBody = {
    lastName,
    firstName
  };

  const response = await fetch(`${API_BASE}/getPlayerHoleByHoleHistoryReport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch player hole by hole history report');
  }

  return response.json();
}

// Add the new response type for the Player Hole by Hole History report
export interface PlayerHoleByHoleHistoryResult {
  rounds: string;
  course: string;
  lastName: string;
  firstName: string;
  hole: string;
  average: string;
}

export interface PlayerHoleByHoleHistoryResponse {
  status: {
    code: number;
    message: string;
  };
  results: PlayerHoleByHoleHistoryResult[];
} 
export interface MatchplayLeader {
  gameID: string;
  matchID: string;
  homeTeamName: string;
  matchplayScore: string;
  awayTeamName: string;
  homeTeamScore: number;
  awayTeamScore: number;
  thruHole: string;
  holesPlayed: string;
}

export interface MatchplayResponse {
  status: {
    code: number;
    message: string;
  };
  gameID: string;
  leaders: MatchplayLeader[][];
  headers: string[][];
  gameTypes: string[];
}

export interface TeamLeader {
  teamID: string;
  teamName: string;
  relativeScore: number;
  absoluteScore: number;
  holesPlayed: string;
}

export interface TeamLeaderboardResponse {
  status: {
    code: number;
    message: string;
  };
  gameID: string;
  leaders: TeamLeader[][];
  headers: string[][];
  gameTypes: string[];
}

export interface PlayerLeader {
  playerID: string;
  playerName: string;
  grossScore: number;
  absoluteScore: string;
  relativeScore: string;
  holesPlayed: string;
  place: number;
  handicap: string;
}

interface ApiStatus {
  code: number;
  message: string;
}

export interface PlayerLeaderboardResponse {
  status: ApiStatus;
  leaders: PlayerLeader[][];
  headers: string[][];
  gameTypes: string[];
}

export interface Skin {
  playerID: string;
  firstName: string;
  lastName: string;
  type: 'Net' | 'Gross';
  gameID: number;
  holeNumber: number;
  score: string;
  gross: number;
}

export interface SkinsResponse {
  status: {
    code: number;
    message: string;
  };
  gameID: string;
  skins: Skin[][];
  gameTypes: string[];
}

export interface Payout {
  payoutID: string;
  payoutName: string;
  gamePayout: number;
  skinsPayout: number;
  totalPayout: number;
}

export interface PayoutsResponse {
  status: {
    code: number;
    message: string;
  };
  gameID: string;
  payouts: Payout[][];
  headers: string[][];
  gameTypes: string[];
}
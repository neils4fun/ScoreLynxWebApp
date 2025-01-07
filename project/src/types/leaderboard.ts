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
  gameTypes: string[];
}

export interface PlayerLeader {
  playerID: string;
  playerName: string;
  handicap: string;
  grossScore: number;
  relativeScore: number;
  holesPlayed: string;
}

export interface PlayerLeaderboardResponse {
  status: {
    code: number;
    message: string;
  };
  gameID: string;
  leaders: PlayerLeader[][];
  gameTypes: string[];
}

export interface Skin {
  playerID: number;
  firstName: string;
  lastName: string;
  type: string;
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
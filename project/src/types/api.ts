export interface APIResponse<T> {
  status: {
    code: number;
    message: string;
  };
  groups: T[];
  games?: Game[];
}

export interface GolfGroup {
  groupID: string;
  groupName: string;
  password?: string;
}

export interface Game {
  gameID: string;
  gameKey: string;
  gameType: string;
  skinType: string;
  courseName: string;
  teeName: string;
  round: string;
  teamPlayerType: string;
}

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
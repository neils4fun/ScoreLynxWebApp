export interface Tee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
}

export interface Score {
  scoreID: string;
  holeNumber: number;
  grossScore: number;
  netScore: number;
}

export interface Player {
  playerID: string;
  firstName: string;
  lastName: string;
  handicap: string;
  venmoName: string | null;
  tee: Tee;
  scores: Score[];
}

export interface ScorecardSummary {
  scorecardID: string;
  name: string;
}

export interface ScorecardListResponse {
  status: {
    code: number;
    message: string;
  };
  scorecards: ScorecardSummary[];
}

export interface ScorecardPlayerListResponse {
  status: {
    code: number;
    message: string;
  };
  players: Player[];
}
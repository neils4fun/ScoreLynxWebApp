export interface Tee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
}

export interface Junk {
  junkID: string;
  junkName: string;
  description: string;
  value: string;
}

export interface Score {
  scoreID?: string;
  holeNumber: number;
  grossScore: number;
  netScore: number;
  junks?: Junk[];
}

export interface Player {
  playerID: string;
  firstName: string;
  lastName: string;
  handicap: string | null;
  venmoName: string | null;
  didPay?: string;
  tee?: {
    teeID: string;
    name: string;
    slope: number;
    rating: number;
  };
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
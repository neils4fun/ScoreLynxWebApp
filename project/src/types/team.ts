export interface Team {
  teamID: string;
  teamName: string;
  score: number;
  netScore: number;
}

export interface Score {
  holeNumber: number;
  grossScore: number;
  netScore: number;
}

export interface TeamScore {
  playerID: string;
  firstName: string;
  lastName: string;
  handicap?: string;
  venmoName: string | null;
  didPay: string;
  tee?: {
    teeID: string;
    name: string;
    slope: number;
    rating: number;
  };
  scores: Score[];
}

export interface TeamScoresResponse {
  players: TeamScore[];
} 
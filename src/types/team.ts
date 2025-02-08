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
  handicap: number;
  scores: Score[];
}

export interface TeamScoresResponse {
  players: TeamScore[];
} 
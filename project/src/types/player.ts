export interface Tee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
}

interface Score {
  grossScore?: number;
  netScore?: number;
}

export interface Player {
  playerID: string;
  firstName: string;
  lastName: string;
  handicap: string | null;
  venmoName: string | null;
  didPay: string;
  email?: string | null;
  tee?: Tee;
  scores: Score[];
} 
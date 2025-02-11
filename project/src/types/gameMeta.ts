export interface GameMeta {
  type: string;
  description: string;
  teamPlayerType: 'Player' | 'Team' | 'Matchplay';
}

export interface GameMetaResponse {
  status: {
    code: number;
    message: string;
  };
  gameMetaList: GameMeta[];
} 
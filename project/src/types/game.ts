export interface GolfGroup {
  groupID: string;
  groupName: string;
  password?: string;
}

export interface Game {
  gameID: string;
  groupID: string;
  name: string;
  courseID: string;
  courseName: string;
  teamPlayerType: 'Player' | 'Team' | 'Matchplay';
  date: string;
  status: string;
  gameKey: string;
  gameType: string;
  skinType: string;
  teeName: string;
  round: string;
}
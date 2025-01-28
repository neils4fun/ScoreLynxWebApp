export interface GolfGroup {
  groupID: string;
  groupName: string;
  password?: string;
}

export interface Game {
  gameID: string;
  name: string;
  date: string;
  courseName: string;
  teamPlayerType: 'Player' | 'Team';
  gameKey: string;
  gameType: string;
  skinType: string;
  courseID: string;
  teeName: string;
  round: string;
}
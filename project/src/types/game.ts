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